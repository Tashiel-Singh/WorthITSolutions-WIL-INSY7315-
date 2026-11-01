import { describe, it, expect } from 'vitest';
import { calculateBulkTierDiscount } from '../utils/taxCalculations';

describe('Bulk tiers are driven by total units (match the API)', () => {
  it('2 x 24-packs (48 units) earn the 25% tier', () => {
    expect(calculateBulkTierDiscount(450, 24, 2).discountRate).toBe(0.25);
  });
  it('5 x 12-packs (60 units) earn the 25% tier with no extra case bonus', () => {
    expect(calculateBulkTierDiscount(450, 12, 5).discountRate).toBe(0.25);
  });
  it('1 x 12-pack earns the 10% tier', () => {
    expect(calculateBulkTierDiscount(450, 12, 1).discountRate).toBe(0.1);
  });
});
