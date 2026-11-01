import { BULK_TIERS, BulkOrderCalculationService } from '../services/BulkOrderCalculationService';

describe('Bulk order pricing and 15% VAT', () => {
  const svc = new BulkOrderCalculationService();

  it.each([[11, 0], [12, 0.1], [23, 0.1], [24, 0.15], [47, 0.15], [48, 0.25], [500, 0.25]])(
    'quantity %i gets discount %f', (qty, rate) => {
      expect(svc.processBulkOrder(100, qty).discountRate).toBe(rate);
    });
  it('matches the documented example', () => {
    const r = svc.processBulkOrder(100, 24);
    expect(r).toMatchObject({ grossTotal: 2400, discountAmount: 360, subtotalExVat: 2040, vatAmount: 306, totalInclVat: 2346 });
  });
  it('VAT is exactly 15% of the discounted subtotal to the cent', () => {
    for (const [price, qty] of [[19.99, 13], [330, 48], [0.99, 7], [450.55, 25]] as const) {
      const r = svc.processBulkOrder(price, qty);
      const subC = Math.round(r.subtotalExVat * 100);
      expect(Math.round(r.vatAmount * 100)).toBe(Math.round(subC * 0.15));
      expect(Math.round(r.totalInclVat * 100)).toBe(subC + Math.round(r.vatAmount * 100));
    }
  });
  it('rejects invalid input', () => {
    expect(() => svc.processBulkOrder(0, 5)).toThrow(RangeError);
    expect(() => svc.processBulkOrder(-5, 5)).toThrow(RangeError);
    expect(() => svc.processBulkOrder(100, 0)).toThrow(RangeError);
    expect(() => svc.processBulkOrder(100, 1.5)).toThrow(RangeError);
    expect(() => svc.processBulkOrder(NaN, 5)).toThrow(RangeError);
  });
  it('exposes the tier table and VAT rate', () => {
    expect(BULK_TIERS.length).toBe(3);
    expect(BulkOrderCalculationService.VAT_RATE).toBe(0.15);
  });
});
