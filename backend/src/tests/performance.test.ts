import { FormalTaxDeductionService } from '../services/FormalTaxDeductionService';

describe('Tax engine performance (target: under 1 second)', () => {
  it('handles 200,000 assets and 200,000 expenses in under 1000 ms', () => {
    const assets = Array.from({ length: 200000 }, (_, i) => ({ cost: 100 + (i % 50) }));
    const expenses = Array.from({ length: 200000 }, (_, i) => ({ amount: 10 + (i % 20) }));
    const start = performance.now();
    const r = new FormalTaxDeductionService().calculateTotalDeduction(assets, expenses, 1000000);
    const elapsed = performance.now() - start;
    console.log(`Tax engine: 400,000 line items in ${elapsed.toFixed(1)} ms`);
    expect(r.totalDeduction).toBeGreaterThan(0);
    expect(elapsed).toBeLessThan(1000);
  });
});
