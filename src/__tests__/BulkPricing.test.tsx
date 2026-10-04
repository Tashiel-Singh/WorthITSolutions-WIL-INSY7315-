import { describe, it, expect } from 'vitest';
import {
  calculateBulkTierDiscount,
  calculateVat,
  calculateSection11eDepreciation,
} from '../utils/taxCalculations';
import { formatCurrency } from '../utils/formatters';

describe('B2B Bulk Pricing & South African VAT Engine', () => {
  const baseUnitPrice = 450.0; // CBD Oil 1000mg base unit price

  it('calculates 10% volume discount for 12-unit pack tier', () => {
    const pricing = calculateBulkTierDiscount(baseUnitPrice, 12, 1);
    expect(pricing.totalUnits).toBe(12);
    expect(pricing.discountRate).toBe(0.10);
    expect(pricing.grossAmount).toBe(5400.0);
    expect(pricing.discountAmount).toBe(540.0);
    expect(pricing.netAmount).toBe(4860.0);
  });

  it('calculates 15% volume discount for 24-unit pack tier', () => {
    const pricing = calculateBulkTierDiscount(baseUnitPrice, 24, 2);
    expect(pricing.totalUnits).toBe(48);
    expect(pricing.discountRate).toBe(0.15);
    expect(pricing.grossAmount).toBe(21600.0);
    expect(pricing.discountAmount).toBe(3240.0);
    expect(pricing.netAmount).toBe(18360.0);
  });

  it('calculates 25% maximum volume discount for 48-unit master crate tier', () => {
    const pricing = calculateBulkTierDiscount(baseUnitPrice, 48, 1);
    expect(pricing.totalUnits).toBe(48);
    expect(pricing.discountRate).toBe(0.25);
    expect(pricing.grossAmount).toBe(21600.0);
    expect(pricing.discountAmount).toBe(5400.0);
    expect(pricing.netAmount).toBe(16200.0);
  });

  it('computes mandatory 15% South African VAT on net wholesale subtotal', () => {
    const netSubtotal = 16200.0;
    const vatResult = calculateVat(netSubtotal, 0.15);
    expect(vatResult.vatAmount).toBe(2430.0);
    expect(vatResult.totalWithVat).toBe(18630.0);
  });

  it('formats South African Rand currency strings according to medical accounting standards', () => {
    const formatted = formatCurrency(18630);
    expect(formatted).toMatch(/R/);
    expect(formatted).toMatch(/18/);
    expect(formatted).toMatch(/630/);
  });

  it('models SARS Section 11(e) wear-and-tear annual depreciation correctly', () => {
    const result = calculateSection11eDepreciation(120000, 35000, 245000);
    expect(result.wearAndTearDeduction).toBe(18000); // 120000 * 0.15
    expect(result.operationalDeduction).toBe(35000);
    expect(result.vatInputCredit).toBe(36750); // 245000 * 0.15
    expect(result.totalTaxShield).toBe(89750);
    expect(result.taxLiabilityReducedPct).toBeGreaterThanOrEqual(15);
  });
});
