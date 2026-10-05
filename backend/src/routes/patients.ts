import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { audit } from '../lib/audit';
import { asyncHandler, HttpError, validate } from '../middleware/errors';
import { authenticate, requireRole } from '../middleware/auth';

// POPIA data-subject rights + consent management
export const patientsRouter = Router();
patientsRouter.use(authenticate);
const idParam = z.object({ id: z.string().uuid() });

// POST /api/patients/consent  - caller records/withdraws consent for a purpose (timestamped, append-only)
patientsRouter.post('/consent', validate(z.object({
  purpose: z.enum(['DATA_STORAGE', 'REFILL_REMINDERS']), granted: z.boolean(),
})), asyncHandler(async (req, res) => {
  const c = await prisma.consentRecord.create({ data: { userId: req.user!.id, ...req.body } });
  await audit(req, 'CONSENT', 'ConsentRecord', c.id, req.body);
  res.status(201).json(c);
}));

// GET /api/patients/me/export  - right of access: patient exports their own data
patientsRouter.get('/me/export', requireRole('PATIENT'), asyncHandler(async (req, res) => {
  const patient = await prisma.patient.findUnique({ where: { userId: req.user!.id } });

  if (!patient) {
    throw new HttpError(404, 'Patient record not found');
  }

  const data = await exportPatient(patient.id);

  await audit(req, 'POPIA_EXPORT', 'Patient', patient.id);

  res.json(data);
}));
async function exportPatient(id: string) {
  const patient = await prisma.patient.findUnique({ where: { id }, include: { prescriptions: { include: { product: { select: { name: true } } } }, user: { select: { id: true, email: true, createdAt: true } } } });
  if (!patient) throw new HttpError(404, 'Patient not found');
  const consents = patient.userId ? await prisma.consentRecord.findMany({ where: { userId: patient.userId }, orderBy: { createdAt: 'asc' } }) : [];
  return { exportedAt: new Date().toISOString(), patient, consents };
}

// GET /api/patients/:id/export  (OWNER, or the patient themselves)
patientsRouter.get('/:id/export', validate(idParam, 'params'), asyncHandler(async (req, res) => {
  const data = await exportPatient(req.params.id);
  if (req.user!.role !== 'OWNER' && data.patient.userId !== req.user!.id) throw new HttpError(404, 'Patient not found');
  await audit(req, 'POPIA_EXPORT', 'Patient', req.params.id);
  res.json(data);
}));

// POST /api/patients/:id/anonymise  (OWNER) - right to erasure. Prescriptions are retained
// (clinical/financial record-keeping obligation) but become unlinkable to a person.
patientsRouter.post('/:id/anonymise', requireRole('OWNER'), validate(idParam, 'params'), asyncHandler(async (req, res) => {
  const p = await prisma.patient.findUnique({ where: { id: req.params.id } });
  if (!p) throw new HttpError(404, 'Patient not found');
  await prisma.$transaction(async tx => {
    await tx.patient.update({ where: { id: p.id }, data: { name: 'ANONYMISED', dateOfBirth: null, contactNumber: null, anonymisedAt: new Date() } });
    if (p.userId) {
      await tx.user.update({ where: { id: p.userId }, data: { email: `anonymised-${p.userId}@deleted.invalid`, isActive: false } });
      await tx.refreshToken.updateMany({ where: { userId: p.userId, revokedAt: null }, data: { revokedAt: new Date() } });
    }
  });
  await audit(req, 'POPIA_ANONYMISE', 'Patient', p.id);
  res.status(200).json({ id: p.id, anonymised: true });
}));
