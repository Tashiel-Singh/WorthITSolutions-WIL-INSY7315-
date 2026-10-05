import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { audit } from '../lib/audit';
import { asyncHandler, HttpError, validate } from '../middleware/errors';
import { authenticate, requireRole } from '../middleware/auth';

export const productsRouter = Router();
productsRouter.use(authenticate);

const category = z.enum(['CBD_OIL', 'CBD_CAPSULE', 'CBD_TOPICAL', 'CBD_EDIBLE', 'HOMEOPATHIC_REMEDY', 'HOMEOPATHIC_TINCTURE', 'HOMEOPATHIC_CREAM', 'HOMEOPATHIC_DROPS', 'BULK_PACK', 'WELLNESS']);
const idParam = z.object({ id: z.string().uuid() });
const productBody = z.object({ name: z.string().min(1).max(160), category, unitPrice: z.number().min(0), bulkPrice: z.number().min(0), isActive: z.boolean().optional() });

// Bulk pricing is commercially sensitive: only OWNER / PHARMACY_MANAGER see it
const present = (p: any, role: string) => (['OWNER', 'PHARMACY_MANAGER'].includes(role) ? p : (({ bulkPrice, ...rest }) => rest)(p));

// GET /api/products?search=&category=&page=&pageSize=
productsRouter.get('/', validate(z.object({
  search: z.string().max(80).optional(), category: category.optional(),
  page: z.coerce.number().int().min(1).default(1), pageSize: z.coerce.number().int().min(1).max(100).default(25),
}), 'query'), asyncHandler(async (req, res) => {
  const { search, category: cat, page, pageSize } = req.query as any;
  const where = { isActive: true, ...(cat && { category: cat }), ...(search && { name: { contains: search, mode: 'insensitive' as const } }) };
  const [rows, total] = await Promise.all([
    prisma.product.findMany({ where, orderBy: { name: 'asc' }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.product.count({ where }),
  ]);
  res.json({ data: rows.map(p => present(p, req.user!.role)), page, pageSize, total });
}));

// GET /api/products/:id
productsRouter.get('/:id', validate(idParam, 'params'), asyncHandler(async (req, res) => {
  const p = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!p) throw new HttpError(404, 'Product not found');
  res.json(present(p, req.user!.role));
}));

// POST /api/products  (OWNER)
productsRouter.post('/', requireRole('OWNER'), validate(productBody), asyncHandler(async (req, res) => {
  const p = await prisma.product.create({ data: req.body });
  await audit(req, 'CREATE', 'Product', p.id);
  res.status(201).json(p);
}));

// PUT /api/products/:id  (OWNER, full replace)   PATCH (partial)
productsRouter.put('/:id', requireRole('OWNER'), validate(idParam, 'params'), validate(productBody), asyncHandler(async (req, res) => {
  const p = await prisma.product.update({ where: { id: req.params.id }, data: req.body });
  await audit(req, 'UPDATE', 'Product', p.id);
  res.json(p);
}));
productsRouter.patch('/:id', requireRole('OWNER'), validate(idParam, 'params'), validate(productBody.partial().refine(d => Object.keys(d).length > 0, 'No fields to update')), asyncHandler(async (req, res) => {
  const p = await prisma.product.update({ where: { id: req.params.id }, data: req.body });
  await audit(req, 'UPDATE', 'Product', p.id);
  res.json(p);
}));

// DELETE /api/products/:id  (OWNER; soft-delete so historical orders stay intact)
productsRouter.delete('/:id', requireRole('OWNER'), validate(idParam, 'params'), asyncHandler(async (req, res) => {
  await prisma.product.update({ where: { id: req.params.id }, data: { isActive: false } });
  await audit(req, 'DEACTIVATE', 'Product', req.params.id);
  res.status(204).send();
}));
