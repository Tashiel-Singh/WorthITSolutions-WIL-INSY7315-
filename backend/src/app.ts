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
app.set('trust proxy', 1); // behind Azure Front Door
app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: '100kb' }));
app.use(rateLimit({ windowMs: 60_000, limit: 300, standardHeaders: true, legacyHeaders: false }));

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
