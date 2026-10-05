import { Router } from 'express';
import { z } from 'zod';
import { InvoiceStatus, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { audit } from '../lib/audit';
import { asyncHandler, HttpError, validate } from '../middleware/errors';
import { authenticate, requireRole } from '../middleware/auth';

export const invoicesRouter = Router();
invoicesRouter.use(authenticate, requireRole('OWNER', 'PHARMACY_MANAGER'));

const idParam = z.object({ id: z.string().uuid() });
const scope = (req: any): Prisma.InvoiceWhereInput => (req.user.role === 'OWNER' ? {} : { order: { pharmacyId: req.user.id } });

// GET /api/invoices
invoicesRouter.get('/', validate(z.object({
  status: z.nativeEnum(InvoiceStatus).optional(),
  page: z.coerce.number().int().min(1).default(1), pageSize: z.coerce.number().int().min(1).max(100).default(25),
}), 'query'), asyncHandler(async (req, res) => {
  const { status, page, pageSize } = req.query as any;
  const where = { ...scope(req), ...(status && { status }) };
  const [data, total] = await Promise.all([
    prisma.invoice.findMany({ where, include: { payments: true }, orderBy: { dueDate: 'asc' }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.invoice.count({ where }),
  ]);
  res.json({ data, page, pageSize, total });
}));

// GET /api/invoices/:id
invoicesRouter.get('/:id', validate(idParam, 'params'), asyncHandler(async (req, res) => {
  const inv = await prisma.invoice.findFirst({ where: { id: req.params.id, ...scope(req) }, include: { payments: true, order: { include: { items: { include: { product: { select: { name: true } } } } } } } });
  if (!inv) throw new HttpError(404, 'Invoice not found');
  res.json(inv);
}));

// POST /api/invoices/:id/payments  (OWNER records a payment; partial payments supported)
invoicesRouter.post('/:id/payments', requireRole('OWNER'), validate(idParam, 'params'), validate(z.object({
  amountPaid: z.number().positive(), method: z.string().min(2).max(40),
})), asyncHandler(async (req, res) => {
  const result = await prisma.$transaction(async tx => {
    const inv = await tx.invoice.findUnique({ where: { id: req.params.id }, include: { payments: true } });
    if (!inv) throw new HttpError(404, 'Invoice not found');
    if (inv.status === 'PAID') throw new HttpError(409, 'Invoice is already paid');
    const paidSoFar = inv.payments.reduce((s, p) => s.add(p.amountPaid), new Prisma.Decimal(0));
    const amount = new Prisma.Decimal(req.body.amountPaid);
    if (paidSoFar.add(amount).gt(inv.totalAmount)) throw new HttpError(422, 'Payment exceeds outstanding balance');
    const payment = await tx.payment.create({ data: { invoiceId: inv.id, amountPaid: amount, method: req.body.method } });
    const fullyPaid = paidSoFar.add(amount).eq(inv.totalAmount);
    const invoice = fullyPaid ? await tx.invoice.update({ where: { id: inv.id }, data: { status: 'PAID' } }) : inv;
    return { payment, invoiceStatus: invoice.status };
  });
  await audit(req, 'PAYMENT', 'Invoice', req.params.id, { amount: req.body.amountPaid });
  res.status(201).json(result);
}));
