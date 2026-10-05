import { NextFunction, Request, Response } from 'express';
import { Role } from '@prisma/client';
import { verifyAccessToken } from '../lib/security';
import { HttpError } from './errors';

declare global {
  namespace Express {
    interface Request { user?: { id: string; role: Role } }
  }
}

/** Authentication: requires a valid, unexpired Bearer JWT. */
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next(new HttpError(401, 'Authentication required'));
  try {
    const payload = verifyAccessToken(header.slice(7));
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new HttpError(401, 'Invalid or expired token'));
  }
}

/** RBAC route middleware: 403 unless the caller's role is allow-listed. Use after authenticate. */
export const requireRole = (...allowed: Role[]) => (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) return next(new HttpError(401, 'Authentication required'));
  if (!allowed.includes(req.user.role)) return next(new HttpError(403, 'Insufficient permissions'));
  next();
};
