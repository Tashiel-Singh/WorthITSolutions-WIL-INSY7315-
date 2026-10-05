import { Router } from 'express';
import { z } from 'zod';
import { OrderStatus, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { audit } from '../lib/audit';
import { asyncHandler, HttpError, validate } from '../middleware/errors';
import { authenticate, requireRole } from '../middleware/auth';
import { BulkOrderCalculationService } from '../services/BulkOrderCalculationService';

export const ordersRouter = Router();
ordersRouter.use(authenticate);

const bulkService = new BulkOrderCalculationService();
const VAT = new Prisma.Decimal('0.15');
const idParam = z.object({ id: z.string().uuid() });
const STAFF = ['OWNER', 'PHARMACY_MANAGER'] as const;

// POST /api/orders/bulk-process  -> Role 2 BulkOrderCalculationService.processBulkOrder()
ordersRouter.post('/bulk-process', requireRole(...STAFF), validate(z.object({
  basePrice: z.number().positive(), quantity: z.number().int().positive().max(100000),
})), asyncHandler(async (req, res) => {
  const { basePrice, quantity } = req.body;
  res.status(200).json(bulkService.processBulkOrder(basePrice, quantity));
}));

// Ownership scope (IDOR protection): pharmacy managers only ever see their own orders
const scope = (req: any): Prisma.OrderWhereInput => (req.user.role === 'OWNER' ? {} : { pharmacyId: req.user.id });
const include = { items: { include: { product: { select: { name: true } } } }, invoice: true } as const;

// GET /api/orders
ordersRouter.get('/', requireRole(...STAFF), validate(z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  page: z.coerce.number().int().min(1).default(1), pageSize: z.coerce.number().int().min(1).max(100).default(25),
}), 'query'), asyncHandler(async (req, res) => {
  const { status, page, pageSize } = req.query as any;
  const where = { ...scope(req), ...(status && { status }) };
  const [data, total] = await Promise.all([
    prisma.order.findMany({ where, include, orderBy: { orderDate: 'desc' }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.order.count({ where }),
  ]);
  res.json({ data, page, pageSize, total });
}));

// GET /api/orders/:id
ordersRouter.get('/:id', requireRole(...STAFF), validate(idParam, 'params'), asyncHandler(async (req, res) => {
  const o = await prisma.order.findFirst({ where: { id: req.params.id, ...scope(req) }, include });
  if (!o) throw new HttpError(404, 'Order not found'); // 404 (not 403) so IDs can't be probed
  res.json(o);
}));

const createSchema = z.object({
  pharmacyId: z.string().uuid().optional(), // only honoured for OWNER placing on behalf of a pharmacy
  items: z.array(z.object({ productId: z.string().uuid(), quantity: z.number().int().positive().max(100000) })).min(1).max(100),
});

// POST /api/orders  - verifies BULK stock, reserves it, creates order + items + invoice + transaction atomically
ordersRouter.post('/', requireRole(...STAFF), validate(createSchema), asyncHandler(async (req, res) => {
  const b = req.body as z.infer<typeof createSchema>;
  const pharmacyId = req.user!.role === 'OWNER' ? b.pharmacyId : req.user!.id;
  if (!pharmacyId) throw new HttpError(400, 'pharmacyId is required when the owner places an order');

  const result = await prisma.$transaction(async tx => {
    const pharmacy = await tx.pharmacy.findUnique({ where: { id: pharmacyId } });
    if (!pharmacy) throw new HttpError(404, 'Pharmacy not found');

    // merge duplicate product lines
    const wanted = new Map<string, number>();
    for (const i of b.items) wanted.set(i.productId, (wanted.get(i.productId) ?? 0) + i.quantity);
    const products = await tx.product.findMany({ where: { id: { in: [...wanted.keys()] }, isActive: true } });
    if (products.length !== wanted.size) throw new HttpError(400, 'One or more products are unavailable');

    let subtotal = new Prisma.Decimal(0);
    let totalQty = 0;
    const lines: { productId: string; quantity: number; unitPrice: Prisma.Decimal }[] = [];

    for (const p of products) {
      const qty = wanted.get(p.id)!;
      // Reserve from the BULK pool only (cannibalisation protection), earliest expiry first (FEFO)
      const pools = await tx.inventoryItem.findMany({
        where: { productId: p.id, poolType: 'BULK', quantityOnHand: { gt: 0 }, OR: [{ expiryDate: null }, { expiryDate: { gt: new Date() } }] },
        orderBy: [{ expiryDate: { sort: 'asc', nulls: 'last' } }],
      });
      let remaining = qty;
      for (const pool of pools) {
        if (remaining === 0) break;
        const take = Math.min(pool.quantityOnHand, remaining);
        // guarded atomic decrement: fails (count 0) if another order took the stock concurrently
        const upd = await tx.inventoryItem.updateMany({ where: { id: pool.id, quantityOnHand: { gte: take } }, data: { quantityOnHand: { decrement: take } } });
        if (upd.count !== 1) throw new HttpError(409, `Stock changed while ordering ${p.name}; please retry`);
        remaining -= take;
      }
      if (remaining > 0) throw new HttpError(409, `Insufficient bulk stock for ${p.name}`);

      // tiered discount through the shared Role 2 service, applied per line
      const calc = bulkService.processBulkOrder(Number(p.bulkPrice), qty);
      const unitPrice = new Prisma.Decimal(calc.subtotalExVat).div(qty).toDecimalPlaces(2);
      subtotal = subtotal.add(calc.subtotalExVat);
      totalQty += qty;
      lines.push({ productId: p.id, quantity: qty, unitPrice });
    }

    const vat = subtotal.mul(VAT).toDecimalPlaces(2);
    const order = await tx.order.create({ data: {
      pharmacyId, status: 'CONFIRMED', channel: 'PHARMACY', quantity: totalQty, bulkRevenue: subtotal,
      items: { create: lines },
    } });
    const due = new Date(); due.setDate(due.getDate() + pharmacy.creditTermsDays);
    const invoice = await tx.invoice.create({ data: { orderId: order.id, vatAmount: vat, totalAmount: subtotal.add(vat), dueDate: due, status: 'SENT' } });
    await tx.transaction.create({ data: { orderId: order.id, channel: 'PHARMACY', amount: subtotal, bulkRevenue: subtotal, quantity: totalQty, description: `Bulk order ${order.id}` } });
    return { order, invoice };
  });

  await audit(req, 'CREATE', 'Order', result.order.id, { total: result.invoice.totalAmount.toString() });
  res.status(201).json(result);
}));

// Allowed lifecycle transitions (WIL doc, Order State Diagram)
const NEXT: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'], CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED'], SHIPPED: ['DELIVERED'], DELIVERED: [], CANCELLED: [],
};

// PATCH /api/orders/:id/status  (OWNER)
ordersRouter.patch('/:id/status', requireRole('OWNER'), validate(idParam, 'params'),
  validate(z.object({ status: z.nativeEnum(OrderStatus).refine(s => s !== 'CANCELLED', 'Use POST /:id/cancel to cancel') })),
  asyncHandler(async (req, res) => {
    const o = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!o) throw new HttpError(404, 'Order not found');
    if (!NEXT[o.status].includes(req.body.status)) throw new HttpError(409, `Cannot move order from ${o.status} to ${req.body.status}`);
    const updated = await prisma.order.update({ where: { id: o.id }, data: { status: req.body.status } });
    await audit(req, 'STATUS_CHANGE', 'Order', o.id, { from: o.status, to: req.body.status });
    res.json(updated);
  }));

// POST /api/orders/:id/cancel  (OWNER or the owning pharmacy; only PENDING/CONFIRMED) - returns stock to BULK pool
ordersRouter.post('/:id/cancel', requireRole(...STAFF), validate(idParam, 'params'), asyncHandler(async (req, res) => {
  const cancelled = await prisma.$transaction(async tx => {
    const o = await tx.order.findFirst({ where: { id: req.params.id, ...scope(req) }, include: { items: true } });
    if (!o) throw new HttpError(404, 'Order not found');
    if (!['PENDING', 'CONFIRMED'].includes(o.status)) throw new HttpError(409, 'Order can no longer be cancelled in the system');
    for (const item of o.items) {
      const pool = await tx.inventoryItem.findFirst({ where: { productId: item.productId, poolType: 'BULK' }, orderBy: { expiryDate: 'asc' } });
      if (pool) await tx.inventoryItem.update({ where: { id: pool.id }, data: { quantityOnHand: { increment: item.quantity } } });
    }
    await tx.transaction.deleteMany({ where: { orderId: o.id } });
    return tx.order.update({ where: { id: o.id }, data: { status: 'CANCELLED' } });
  });
  await audit(req, 'CANCEL', 'Order', cancelled.id);
  res.json(cancelled);
}));
