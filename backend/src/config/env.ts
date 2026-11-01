import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: (() => {
    const s = process.env.JWT_SECRET;
    if (!s && process.env.NODE_ENV === 'production') throw new Error('JWT_SECRET is required in production');
    return s || 'dev-only-insecure-secret-change-me-0123456789';
  })(),
  jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES ?? '15m', // spec: 15-minute access tokens
  refreshTokenDays: Number(process.env.REFRESH_TOKEN_DAYS ?? 7),
  bcryptCost: Number(process.env.BCRYPT_COST ?? 12), // spec: cost factor 12
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173,http://localhost:4173,https://medflow-web-wil26sc.onrender.com,https://tashiel-singh.github.io',
};

if (env.jwtSecret.length < 32) throw new Error('JWT_SECRET must be at least 32 characters');
