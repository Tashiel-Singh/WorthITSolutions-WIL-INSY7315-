import { FormalTaxDeductionService } from '../services/FormalTaxDeductionService';
import { BulkVatInputStrategy, DepreciationStrategy, ITaxStrategy, OperatingExpenseStrategy, TaxCalculator } from '../services/TaxStrategies';

describe('Tax deduction engine (Strategy pattern)', () => {
  const svc = new FormalTaxDeductionService();

  it('applies the published formula', () => {
    const r = svc.calculateTotalDeduction([{ cost: 1000 }], [{ amount: 1000 }], 1000);
    expect(r).toEqual({ depreciationDeduction: 200, expenseDeduction: 150, vatInputDeduction: 50, totalDeduction: 400 });
  });
  it('returns zero for empty inputs', () => {
    expect(svc.calculateTotalDeduction([], [], 0).totalDeduction).toBe(0);
  });
  it('excludes non-depreciable assets', () => {
    const r = svc.calculateTotalDeduction([{ cost: 1000, depreciable: false }, { cost: 500 }], [], 0);
    expect(r.depreciationDeduction).toBe(100);
  });
  it('has no floating point drift', () => {
    expect(svc.calculateTotalDeduction([{ cost: 0.1 }, { cost: 0.2 }], [], 0).depreciationDeduction).toBe(0.06);
  });
  it('rejects negative, NaN and Infinity inputs', () => {
    expect(() => svc.calculateTotalDeduction([{ cost: -1 }], [], 0)).toThrow(RangeError);
    expect(() => svc.calculateTotalDeduction([], [{ amount: NaN }], 0)).toThrow(RangeError);
    expect(() => svc.calculateTotalDeduction([], [], Infinity)).toThrow(RangeError);
  });
  it('rejects non-array input', () => {
    expect(() => svc.calculateTotalDeduction(null as any, [], 0)).toThrow(TypeError);
  });
  it('strategies are individually configurable', () => {
    const input = { assets: [{ cost: 100 }], expenses: [{ amount: 100 }], bulkRevenue: 100 };
    expect(new DepreciationStrategy(0.25).calculateCents(input)).toBe(2500);
    expect(new OperatingExpenseStrategy(0.5).calculateCents(input)).toBe(5000);
    expect(new BulkVatInputStrategy(0.1).calculateCents(input)).toBe(1000);
  });
  it('strategies can be swapped without changing the context or callers', () => {
    const flat: ITaxStrategy = { name: 'flat', calculateCents: () => 12345 };
    expect(new TaxCalculator([flat]).calculate({ assets: [], expenses: [], bulkRevenue: 0 }).totalCents).toBe(12345);
    const custom = new FormalTaxDeductionService([new DepreciationStrategy(0.25)]);
    const r = custom.calculateTotalDeduction([{ cost: 100 }], [{ amount: 100 }], 100);
    expect(r.depreciationDeduction).toBe(25);
    expect(r.expenseDeduction).toBe(0);
  });
  it('requires at least one strategy', () => {
    expect(() => new TaxCalculator([])).toThrow();
  });
});
