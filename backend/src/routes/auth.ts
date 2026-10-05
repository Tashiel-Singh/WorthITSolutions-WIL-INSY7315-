import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { hashPassword, hashToken, newRefreshToken, PASSWORD_REGEX, signAccessToken, verifyPassword } from '../lib/security';
import { audit } from '../lib/audit';
import { asyncHandler, HttpError, validate } from '../middleware/errors';
import { authenticate } from '../middleware/auth';

export const authRouter = Router();

const MAX_FAILED = 5;
const LOCK_MINUTES = 15;
const DUMMY_HASH = '$2b$12$C6UzMDM.H6dfI/f/IKcEeO5T0r1kLwq0M0gVQZ3N8m6X5qv9sB8lK'; // timing equaliser

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many attempts, try later' } });

const registerSchema = z.object({
  email: z.string().email().max(254).transform(s => s.toLowerCase()),
  password: z.string().regex(PASSWORD_REGEX, 'Min 10 chars with upper, lower and a digit'),
  name: z.string().min(1).max(120),
  role: z.enum(['PATIENT', 'LEISURE_CLIENT']), // privileged roles are created by the OWNER via /api/users
  dateOfBirth: z.coerce.date().optional(),
  contactNumber: z.string().max(30).optional(),
  consentToDataStorage: z.literal(true, { errorMap: () => ({ message: 'POPIA consent is required to register' }) }),
  consentToReminders: z.boolean().default(false),
});

// POST /api/auth/register  (self-service for patients / leisure clients; logs POPIA consent)
authRouter.post('/register', loginLimiter, validate(registerSchema), asyncHandler(async (req, res) => {
  const b = req.body as z.infer<typeof registerSchema>;
  const passwordHash = await hashPassword(b.password);
  const user = await prisma.$transaction(async tx => {
    const u = await tx.user.create({ data: { email: b.email, passwordHash, role: b.role } });
    if (b.role === 'PATIENT') {
      await tx.patient.create({ data: { userId: u.id, name: b.name, dateOfBirth: b.dateOfBirth, contactNumber: b.contactNumber } });
    }
    await tx.consentRecord.createMany({ data: [
      { userId: u.id, purpose: 'DATA_STORAGE', granted: true },
      { userId: u.id, purpose: 'REFILL_REMINDERS', granted: b.consentToReminders },
    ] });
    return u;
  });
  await audit(req, 'REGISTER', 'User', user.id, undefined, user.id);
  res.status(201).json({ id: user.id, email: user.email, role: user.role });
}));

const loginSchema = z.object({ email: z.string().email().transform(s => s.toLowerCase()), password: z.string().min(1).max(128) });

// POST /api/auth/login
authRouter.post('/login', loginLimiter, validate(loginSchema), asyncHandler(async (req, res) => {
  const { email, password } = req.body as z.infer<typeof loginSchema>;
  const user = await prisma.user.findUnique({ where: { email } });

  if (user?.lockedUntil && user.lockedUntil > new Date()) {
    throw new HttpError(423, 'Account temporarily locked. Try again later.');
  }
  const ok = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH); // always hash-compare
  if (!user || !user.isActive || !ok) {
    if (user) {
      const attempts = user.failedLoginAttempts + 1;
      await prisma.user.update({ where: { id: user.id }, data: {
        failedLoginAttempts: attempts >= MAX_FAILED ? 0 : attempts,
        lockedUntil: attempts >= MAX_FAILED ? new Date(Date.now() + LOCK_MINUTES * 60_000) : null,
      } });
      await audit(req, 'LOGIN_FAILED', 'User', user.id, undefined, user.id);
    }
    throw new HttpError(401, 'Invalid email or password'); // identical message: no user enumeration
  }

  await prisma.user.update({ where: { id: user.id }, data: { failedLoginAttempts: 0, lockedUntil: null } });
  const refresh = newRefreshToken();
  await prisma.refreshToken.create({ data: { userId: user.id, tokenHash: refresh.hash, expiresAt: refresh.expiresAt } });
  await audit(req, 'LOGIN', 'User', user.id, undefined, user.id);
  res.json({
    accessToken: signAccessToken({ sub: user.id, role: user.role }),
    expiresIn: 900,
    refreshToken: refresh.raw,
    user: { id: user.id, email: user.email, role: user.role },
  });
}));

const refreshSchema = z.object({ refreshToken: z.string().min(20).max(256) });

// POST /api/auth/refresh  (rotates the refresh token)
authRouter.post('/refresh', validate(refreshSchema), asyncHandler(async (req, res) => {
  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash: hashToken(req.body.refreshToken) }, include: { user: true } });
  if (!stored || stored.revokedAt || stored.expiresAt < new Date() || !stored.user.isActive) throw new HttpError(401, 'Invalid refresh token');
  const next = newRefreshToken();
  await prisma.$transaction([
    prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } }),
    prisma.refreshToken.create({ data: { userId: stored.userId, tokenHash: next.hash, expiresAt: next.expiresAt } }),
  ]);
  res.json({ accessToken: signAccessToken({ sub: stored.userId, role: stored.user.role }), expiresIn: 900, refreshToken: next.raw });
}));

// POST /api/auth/logout
authRouter.post('/logout', authenticate, validate(refreshSchema), asyncHandler(async (req, res) => {
  await prisma.refreshToken.updateMany({ where: { tokenHash: hashToken(req.body.refreshToken), userId: req.user!.id, revokedAt: null }, data: { revokedAt: new Date() } });
  await audit(req, 'LOGOUT', 'User', req.user!.id);
  res.status(204).send();
}));
