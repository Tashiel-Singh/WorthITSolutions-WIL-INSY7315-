import { TaxCalculationService, StandardVATStrategy, WholesaleTaxStrategy, TaxCalculationError } from '../services/TaxCalculationService';
import { InventoryService, InventoryError } from '../services/InventoryService';

describe('TaxCalculationService', () => {
  it('calculates standard VAT', () => {
    const s = new TaxCalculationService(new StandardVATStrategy());
    expect(s.executeTaxCalculation(100)).toBe(15.00);
  });
  it('calculates wholesale tax', () => {
    const s = new TaxCalculationService(new WholesaleTaxStrategy());
    expect(s.executeTaxCalculation(1000)).toBe(0.00);
  });
  it('throws on negative', () => {
    const s = new TaxCalculationService(new StandardVATStrategy());
    expect(() => s.executeTaxCalculation(-50)).toThrow(TaxCalculationError);
  });
  it('handles unexpected strategy errors gracefully', () => {
    const faultyStrategy = { calculate: () => { throw new Error('System crash'); } };
    const s = new TaxCalculationService(faultyStrategy as any);
    expect(() => s.executeTaxCalculation(100)).toThrow(TaxCalculationError);
  });
});

describe('InventoryService', () => {
  it('allocates retail stock', () => {
    const inv = new InventoryService();
    expect(inv.allocateStock('PROD-RET-01', 5, 'RETAIL')).toBe(true);
    expect(inv.getStockLevel('PROD-RET-01', 'RETAIL')).toBe(20);
  });
  it('prevents cannibalization', () => {
    const inv = new InventoryService();
    expect(() => inv.allocateStock('PROD-RET-01', 50, 'RETAIL')).toThrow(InventoryError);
  });
  it('throws on invalid quantity or missing SKU', () => {
    const inv = new InventoryService();
    expect(() => inv.allocateStock('PROD-RET-01', 0, 'RETAIL')).toThrow(InventoryError);
    expect(() => inv.allocateStock('FAKE-SKU', 5, 'RETAIL')).toThrow(InventoryError);
  });
});

import { FormalTaxDeductionService } from '../services/FormalTaxDeductionService';
import { RevenueSegregationService } from '../services/RevenueSegregationService';
import { BulkOrderCalculationService } from '../services/BulkOrderCalculationService';

describe('Sprint Logic Expansion Services', () => {
  it('calculates formal multi-variable tax deduction', () => {
    const deduction = FormalTaxDeductionService.calculateTotalDeduction({
      depreciableAssets: [10000],
      operationalExpenses: [5000],
      bulkRevenue: 20000
    });
    // (10000 * 0.20) + (5000 * 0.15) + (20000 * 0.05) = 2000 + 750 + 1000 = 3750
    expect(deduction).toBe(3750.00);
  });

  it('aggregates revenue by channel correctly', () => {
    const breakdown = RevenueSegregationService.aggregateRevenueByChannel([
      { id: '1', channel: 'PATIENT', amount: 100 },
      { id: '2', channel: 'PHARMACY', amount: 1000 },
      { id: '3', channel: 'PATIENT', amount: 50 }
    ]);
    expect(breakdown.PATIENT).toBe(150);
    expect(breakdown.PHARMACY).toBe(1000);
    expect(breakdown.LEISURE).toBe(0);
  });

  it('applies bulk tier discounts and calculates VAT', () => {
    const res = BulkOrderCalculationService.processBulkOrder(100, 50);
    // 50 * 100 = 5000. 15% discount = 750. Discounted = 4250. VAT (15%) = 637.5. Total = 4887.5
    expect(res.discountApplied).toBe(750.00);
    expect(res.vatAmount).toBe(637.50);
    expect(res.finalTotal).toBe(4887.50);
  });
});

  it('handles intermediate bulk discount tiers and zero discount', () => {
    const tier2 = BulkOrderCalculationService.processBulkOrder(100, 25); // 10% discount tier
    expect(tier2.discountApplied).toBe(250.00);

    const tier3 = BulkOrderCalculationService.processBulkOrder(100, 5);  // Zero discount tier
    expect(tier3.discountApplied).toBe(0.00);
  });
