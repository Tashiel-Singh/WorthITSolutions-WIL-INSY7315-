process.env.JWT_SECRET = 'test-secret-test-secret-test-secret-123456';
process.env.BCRYPT_COST = '12';

import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { hashPassword, verifyPassword, signAccessToken, verifyAccessToken, PASSWORD_REGEX, newRefreshToken } from '../lib/security';
import { requireRole } from '../middleware/auth';

describe('password hashing (bcrypt, cost 12)', () => {
  it('hashes with cost factor 12 and verifies', async () => {
    const h = await hashPassword('Str0ngPassword');
    expect(h.startsWith('$2b$12$')).toBe(true);
    expect(h).not.toContain('Str0ngPassword');
    expect(await verifyPassword('Str0ngPassword', h)).toBe(true);
    expect(await verifyPassword('wrong', h)).toBe(false);
  });
  it('enforces password policy', () => {
    expect(PASSWORD_REGEX.test('short1A')).toBe(false);
    expect(PASSWORD_REGEX.test('alllowercase123')).toBe(false);
    expect(PASSWORD_REGEX.test('GoodPassw0rd')).toBe(true);
  });
});

describe('JWT access tokens', () => {
  it('expire after 15 minutes', () => {
    const t = signAccessToken({ sub: 'u1', role: 'OWNER' });
    const d = jwt.decode(t) as any;
    expect(d.exp - d.iat).toBe(15 * 60);
    expect(verifyAccessToken(t).role).toBe('OWNER');
  });
  it('rejects tampered, expired and alg=none tokens', () => {
    const t = signAccessToken({ sub: 'u1', role: 'OWNER' });
    expect(() => verifyAccessToken(t + 'x')).toThrow();
    const expired = jwt.sign({ sub: 'u1', role: 'OWNER' }, process.env.JWT_SECRET!, { expiresIn: -10 });
    expect(() => verifyAccessToken(expired)).toThrow();
    const none = Buffer.from('{"alg":"none","typ":"JWT"}').toString('base64url') + '.' + Buffer.from('{"sub":"u1","role":"OWNER"}').toString('base64url') + '.';
    expect(() => verifyAccessToken(none)).toThrow();
  });
  it('refresh tokens are opaque and stored hashed', () => {
    const r = newRefreshToken();
    expect(r.raw).not.toBe(r.hash);
    expect(r.expiresAt.getTime()).toBeGreaterThan(Date.now() + 6.9 * 864e5);
  });
});

describe('RBAC middleware', () => {
  const run = (role: any) => { let err: any; requireRole('OWNER')({ user: role && { id: '1', role } } as any, {} as any, e => (err = e)); return err; };
  it('allows listed role', () => expect(run('OWNER')).toBeUndefined());
  it('403 for other roles', () => expect(run('PHARMACY_MANAGER').status).toBe(403));
  it('401 when unauthenticated', () => expect(run(undefined).status).toBe(401));
});

describe('SQL-injection hygiene', () => {
  it('source never uses unsafe raw SQL APIs', () => {
    const walk = (d: string): string[] => fs.readdirSync(d).flatMap(f => { const p = path.join(d, f); return fs.statSync(p).isDirectory() ? walk(p) : [p]; });
    const files = walk(path.join(__dirname, '..')).filter(f => f.endsWith('.ts') && !f.includes('tests'));
    for (const f of files) expect(fs.readFileSync(f, 'utf8')).not.toMatch(/\$(queryRawUnsafe|executeRawUnsafe)/);
  });
});
