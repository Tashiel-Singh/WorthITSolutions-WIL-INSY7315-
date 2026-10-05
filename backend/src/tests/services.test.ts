import { BulkOrderCalculationService } from '../services/BulkOrderCalculationService';
import { FormalTaxDeductionService } from '../services/FormalTaxDeductionService';
import { RevenueSegregationService } from '../services/RevenueSegregationService';

it('bulk discount tiers + 15% VAT split', () => {
  const r = new BulkOrderCalculationService().processBulkOrder(100, 24);
  expect(r.discountRate).toBe(0.1);
  expect(r.subtotalExVat).toBe(2160);
  expect(r.vatAmount).toBe(324);
  expect(r.totalInclVat).toBe(2484);
});
it('tax formula: assets*0.20 + expenses*0.15 + bulk*0.05', () => {
  const r = new FormalTaxDeductionService().calculateTotalDeduction([{ cost: 1000 }], [{ amount: 1000 }], 1000);
  expect(r.totalDeduction).toBe(200 + 150 + 50);
});
it('revenue aggregates by channel', () => {
  const r = new RevenueSegregationService().aggregateRevenueByChannel([
    { channel: 'PHARMACY', amount: 100, bulkRevenue: 100, quantity: 5 },
    { channel: 'PATIENT', amount: 50, bulkRevenue: 0, quantity: 1 },
  ]);
  expect(r.totalRevenue).toBe(150);
  expect(r.byChannel.PHARMACY.revenue).toBe(100);
  expect(r.retailRevenue).toBe(50);
});
