import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorHandler, notFound } from './middleware/errors';
import { authRouter } from './routes/auth';
import { usersRouter } from './routes/users';
import { productsRouter } from './routes/products';
import { ordersRouter } from './routes/orders';
import { invoicesRouter } from './routes/invoices';
import { analyticsRouter } from './routes/analytics';
import { taxRouter } from './routes/tax';
import { patientsRouter } from './routes/patients';

export const app = express();
app.set('trust proxy', 1); // behind the hosting platform proxy (Render)
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = env.corsOrigin.split(',').map((s) => s.trim()).filter(Boolean);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, uptime monitors)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        (!isProduction && (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')))
      ) {
        return callback(null, true);
      }
      return callback(null, false); // origin not on the CORS_ORIGIN list: no CORS headers are sent
    },
    credentials: true,
  })
);
app.use(rateLimit({ windowMs: 60_000, limit: 300, standardHeaders: true, legacyHeaders: false }));
app.use(express.json({ limit: '100kb' }));
app.use(express.json({ limit: '100kb' }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/invoices', invoicesRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/tax', taxRouter);
app.use('/api/patients', patientsRouter);

app.use(notFound);
app.use(errorHandler);
