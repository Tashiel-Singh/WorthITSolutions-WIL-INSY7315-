import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { hashPassword, PASSWORD_REGEX } from '../lib/security';
import { audit } from '../lib/audit';
import { asyncHandler, HttpError, validate } from '../middleware/errors';
import { authenticate, requireRole } from '../middleware/auth';

export const usersRouter = Router();
usersRouter.use(authenticate);

const safe = { id: true, email: true, role: true, isActive: true, createdAt: true, updatedAt: true } as const; // never expose passwordHash
const idParam = z.object({ id: z.string().uuid() });
const roleEnum = z.enum(['OWNER', 'PHARMACY_MANAGER', 'PHARMACIST', 'DOCTOR', 'PSYCHIATRIST', 'PATIENT', 'LEISURE_CLIENT']);

// GET /api/users  (OWNER)
usersRouter.get('/', requireRole('OWNER'), validate(z.object({
  role: roleEnum.optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
}), 'query'), asyncHandler(async (req, res) => {
  const { role, page, pageSize } = req.query as any;
  const where = role ? { role } : {};
  const [data, total] = await Promise.all([
    prisma.user.findMany({ where, select: safe, orderBy: { createdAt: 'desc' }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.user.count({ where }),
  ]);
  res.json({ data, page, pageSize, total });
}));

// GET /api/users/me  (any authenticated user)
usersRouter.get('/me', asyncHandler(async (req, res) => {
  res.json(await prisma.user.findUniqueOrThrow({ where: { id: req.user!.id }, select: safe }));
}));

// GET /api/users/:id  (OWNER; IDOR-safe - users may only read themselves)
usersRouter.get('/:id', validate(idParam, 'params'), asyncHandler(async (req, res) => {
  if (req.user!.role !== 'OWNER' && req.user!.id !== req.params.id) throw new HttpError(403, 'Insufficient permissions');
  const u = await prisma.user.findUnique({ where: { id: req.params.id }, select: safe });
  if (!u) throw new HttpError(404, 'User not found');
  res.json(u);
}));

const createSchema = z.object({
  email: z.string().email().transform(s => s.toLowerCase()),
  password: z.string().regex(PASSWORD_REGEX, 'Min 10 chars with upper, lower and a digit'),
  role: roleEnum,
  pharmacy: z.object({ name: z.string().min(1), licenseNumber: z.string().min(1), creditLimit: z.number().min(0).default(0), creditTermsDays: z.number().int().min(0).max(120).default(30) }).optional(),
  prescriber: z.object({ name: z.string().min(1), hpcsaNumber: z.string().min(1), practice: z.string().optional(), specialization: z.string().optional() }).optional(),
}).refine(d => d.role !== 'PHARMACY_MANAGER' || d.pharmacy, { message: 'pharmacy details required for PHARMACY_MANAGER', path: ['pharmacy'] })
  .refine(d => !['DOCTOR', 'PSYCHIATRIST', 'PHARMACIST'].includes(d.role) || d.prescriber, { message: 'prescriber details required', path: ['prescriber'] });

// POST /api/users  (OWNER creates any role)
usersRouter.post('/', requireRole('OWNER'), validate(createSchema), asyncHandler(async (req, res) => {
  const b = req.body as z.infer<typeof createSchema>;
  const passwordHash = await hashPassword(b.password);
  const user = await prisma.$transaction(async tx => {
    const u = await tx.user.create({ data: { email: b.email, passwordHash, role: b.role }, select: safe });
    if (b.role === 'PHARMACY_MANAGER') await tx.pharmacy.create({ data: { id: u.id, ...b.pharmacy! } });
    if (b.prescriber) await tx.prescriber.create({ data: { userId: u.id, type: b.role as 'DOCTOR' | 'PSYCHIATRIST' | 'PHARMACIST', ...b.prescriber } });
    return u;
  });
  await audit(req, 'CREATE', 'User', user.id, { role: b.role });
  res.status(201).json(user);
}));

// PATCH /api/users/:id  (OWNER: role / active / password reset)
usersRouter.patch('/:id', requireRole('OWNER'), validate(idParam, 'params'), validate(z.object({
  role: roleEnum.optional(), isActive: z.boolean().optional(), password: z.string().regex(PASSWORD_REGEX).optional(),
}).refine(d => Object.keys(d).length > 0, 'No fields to update')), asyncHandler(async (req, res) => {
  const { password, ...rest } = req.body;
  const data: any = { ...rest };
  if (password) data.passwordHash = await hashPassword(password);
  const u = await prisma.user.update({ where: { id: req.params.id }, data, select: safe });
  if (rest.isActive === false) await prisma.refreshToken.updateMany({ where: { userId: u.id, revokedAt: null }, data: { revokedAt: new Date() } });
  await audit(req, 'UPDATE', 'User', u.id, { fields: Object.keys(req.body) });
  res.json(u);
}));

// DELETE /api/users/:id  (OWNER; soft-delete = deactivate, preserves financial/audit integrity)
usersRouter.delete('/:id', requireRole('OWNER'), validate(idParam, 'params'), asyncHandler(async (req, res) => {
  if (req.params.id === req.user!.id) throw new HttpError(400, 'You cannot deactivate your own account');
  await prisma.user.update({ where: { id: req.params.id }, data: { isActive: false } });
  await prisma.refreshToken.updateMany({ where: { userId: req.params.id, revokedAt: null }, data: { revokedAt: new Date() } });
  await audit(req, 'DEACTIVATE', 'User', req.params.id);
  res.status(204).send();
}));
