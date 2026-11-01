import { BulkOrderCalculationService } from '../services/BulkOrderCalculationService';
import { FormalTaxDeductionService } from '../services/FormalTaxDeductionService';
import { RevenueSegregationService } from '../services/RevenueSegregationService';
import { InventoryService, InventoryError } from '../services/InventoryService';
import { TaxCalculator, DepreciationStrategy, OperatingExpenseStrategy, BulkVatInputStrategy } from '../services/TaxStrategies';

describe('Role 2 ERP Core Services (Pseudo-Merged Architecture)', () => {
  it('bulk discount tiers + 15% VAT split', () => {
    const r = new BulkOrderCalculationService().processBulkOrder(100, 24);
    expect(r.discountRate).toBe(0.1);
    expect(r.subtotalExVat).toBe(2160);
    expect(r.vatAmount).toBe(324);
    expect(r.totalInclVat).toBe(2484);
  });

  it('tax formula with Strategy pattern: assets*0.20 + expenses*0.15 + bulk*0.05', () => {
    const r = new FormalTaxDeductionService().calculateTotalDeduction([{ cost: 1000 }], [{ amount: 1000 }], 1000);
    expect(r.totalDeduction).toBe(200 + 150 + 50);
    expect(r.depreciationDeduction).toBe(200);
    expect(r.expenseDeduction).toBe(150);
    expect(r.vatInputDeduction).toBe(50);
  });

  it('custom TaxCalculator executes strategy pattern dynamically', () => {
    const calc = new TaxCalculator([new DepreciationStrategy(0.25)]);
    const res = calc.calculate({ assets: [{ cost: 1000 }], expenses: [], bulkRevenue: 0 });
    expect(res.totalDeduction).toBe(250);
  });

  it('revenue aggregates by channel with margin and referral tracking', () => {
    const r = new RevenueSegregationService().aggregateRevenueByChannel([
      { channel: 'PHARMACY', amount: 100, bulkRevenue: 100, quantity: 5 },
      { channel: 'PATIENT', amount: 50, bulkRevenue: 0, quantity: 1 },
    ]);
    expect(r.totalRevenue).toBe(150);
    expect(r.byChannel.PHARMACY.revenue).toBe(100);
    expect(r.retailRevenue).toBe(50);
    expect(r.totalGrossProfit).toBeGreaterThan(0);
    expect(r.referralCommissionsAccrued).toBe(4.25); // 8.5% of R50
  });

  it('InventoryService prevents cannibalization across retail and bulk pools', () => {
    const inv = new InventoryService([
      { id: '1', sku: 'CBD-01', poolType: 'BULK', quantity: 100 },
      { id: '2', sku: 'CBD-01', poolType: 'RETAIL', quantity: 10 },
    ]);

    expect(inv.allocateStock('CBD-01', 50, 'BULK')).toBe(true);
    expect(inv.getStockLevel('CBD-01', 'BULK')).toBe(50);

    // Attempting to over-allocate from RETAIL triggers Cannibalization error
    expect(() => inv.allocateStock('CBD-01', 20, 'RETAIL')).toThrow(InventoryError);
  });
});
