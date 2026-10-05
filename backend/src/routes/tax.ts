import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { audit } from '../lib/audit';
import { asyncHandler, validate } from '../middleware/errors';
import { authenticate, requireRole } from '../middleware/auth';
import { FormalTaxDeductionService } from '../services/FormalTaxDeductionService';

export const taxRouter = Router();
taxRouter.use(authenticate, requireRole('OWNER'));
const service = new FormalTaxDeductionService();

const body = z.object({
  assets: z.array(z.object({ cost: z.number().min(0), depreciable: z.boolean().optional() })).max(5000).optional(),
  expenses: z.array(z.object({ amount: z.number().min(0) })).max(20000).optional(),
  bulkRevenue: z.number().min(0).optional(),
});

// POST /api/tax/calculate-deduction
// Uses asset/expense arrays from the request (audit-log extract). If omitted, falls back to the DB records.
taxRouter.post('/calculate-deduction', validate(body), asyncHandler(async (req, res) => {
  const input = req.body as z.infer<typeof body>;
  const assets = input.assets ?? (await prisma.asset.findMany({ select: { cost: true, depreciable: true } })).map(a => ({ cost: a.cost.toNumber(), depreciable: a.depreciable }));
  const expenses = input.expenses ?? (await prisma.expense.findMany({ select: { amount: true } })).map(e => ({ amount: e.amount.toNumber() }));
  let bulkRevenue = input.bulkRevenue;
  if (bulkRevenue === undefined) {
    const agg = await prisma.transaction.aggregate({ _sum: { bulkRevenue: true } });
    bulkRevenue = agg._sum.bulkRevenue?.toNumber() ?? 0;
  }
  const result = service.calculateTotalDeduction(assets, expenses, bulkRevenue);
  await audit(req, 'TAX_CALCULATION', 'Tax', undefined, { total: result.totalDeduction });
  res.status(200).json({ inputs: { assetCount: assets.length, expenseCount: expenses.length, bulkRevenue }, ...result });
}));
