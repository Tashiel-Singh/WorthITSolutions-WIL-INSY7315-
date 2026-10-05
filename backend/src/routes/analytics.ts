import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { asyncHandler, validate } from '../middleware/errors';
import { authenticate, requireRole } from '../middleware/auth';
import { RevenueSegregationService } from '../services/RevenueSegregationService';

export const analyticsRouter = Router();
analyticsRouter.use(authenticate, requireRole('OWNER'));
const service = new RevenueSegregationService();

// GET /api/analytics/revenue-breakdown?from=&to=
// Queries Prisma for sales records -> RevenueSegregationService.aggregateRevenueByChannel() -> JSON
analyticsRouter.get('/revenue-breakdown', validate(z.object({
  from: z.coerce.date().optional(), to: z.coerce.date().optional(),
}), 'query'), asyncHandler(async (req, res) => {
  const { from, to } = req.query as any;
  const rows = await prisma.transaction.findMany({
    where: { ...((from || to) && { occurredAt: { ...(from && { gte: from }), ...(to && { lte: to }) } }) },
    select: { channel: true, amount: true, bulkRevenue: true, quantity: true },
  });
  const breakdown = service.aggregateRevenueByChannel(rows.map(r => ({
    channel: r.channel, amount: r.amount.toNumber(), bulkRevenue: r.bulkRevenue.toNumber(), quantity: r.quantity,
  })));
  res.status(200).json({ from: from ?? null, to: to ?? null, recordCount: rows.length, ...breakdown });
}));
