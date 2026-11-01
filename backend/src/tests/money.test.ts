import { toCents, fromCents, assertMoney } from '../lib/money';

describe('money helpers', () => {
  it('converts to cents without drift', () => {
    expect(toCents(0.1 + 0.2)).toBe(30);
    expect(toCents(19.99)).toBe(1999);
    expect(fromCents(6)).toBe(0.06);
  });
  it('rejects negative, NaN and Infinity', () => {
    expect(() => assertMoney(-1, 'x')).toThrow(RangeError);
    expect(() => assertMoney(NaN, 'x')).toThrow(RangeError);
    expect(() => assertMoney(Infinity, 'x')).toThrow(RangeError);
    expect(() => assertMoney(5, 'x')).not.toThrow();
  });
});
