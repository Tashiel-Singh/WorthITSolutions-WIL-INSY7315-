import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Role } from '@prisma/client';
import { env } from '../config/env';

export interface AccessTokenPayload {
  sub: string; // user id (== pharmacy id for PHARMACY_MANAGER)
  role: Role;
}

/** bcrypt, cost factor 12 - plain-text passwords never reach the database. */
export const hashPassword = (plain: string) => bcrypt.hash(plain, env.bcryptCost);
export const verifyPassword = (plain: string, hash: string) => bcrypt.compare(plain, hash);

/** Short-lived (15 min) JWT access token, pinned to HS256. */
export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtAccessExpires as any, algorithm: 'HS256' });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  // algorithms pinned -> blocks "alg: none" and algorithm-confusion attacks
  return jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] }) as unknown as AccessTokenPayload;
}

/** Opaque refresh token (7 days). Only its SHA-256 is stored. */
export function newRefreshToken() {
  const raw = crypto.randomBytes(48).toString('hex');
  return {
    raw,
    hash: hashToken(raw),
    expiresAt: new Date(Date.now() + env.refreshTokenDays * 24 * 60 * 60 * 1000),
  };
}
export const hashToken = (raw: string) => crypto.createHash('sha256').update(raw).digest('hex');

/** Password policy: >= 10 chars, upper, lower, digit. */
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,128}$/;
