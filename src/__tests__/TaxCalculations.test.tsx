/**
 * Comprehensive Vitest Unit Tests for SARS Tax Engine & Volume Tiering
 * INSY7315 Task 2 Criterion 2.2 Specification Compliance
 */
import { describe, it, expect } from 'vitest';
import {
  calculateSection11eDepreciation,
  calculateBulkTierDiscount,
  calculateVat,
  RSA_STANDARD_VAT_RATE,
} from '../utils/taxCalculations';

describe('SARS Section 11(e) Tax Optimization Engine (INSY7315 Rubric Formula)', () => {
  it('strictly implements the exact rubric formula: Total Deduction = (Assets * 0.20) + (Expenses * 0.15) + (Turnover * 0.05)', () => {
    // Assets: R 500,000 * 0.20 = R 100,000
    // Expenses: R 200,000 * 0.15 = R 30,000
    // Bulk Turnover: R 800,000 * 0.05 = R 40,000
    // Expected Total Deduction: 100,000 + 30,000 + 40,000 = R 170,000
    const result = calculateSection11eDepreciation(500000, 200000, 800000);

    expect(result.depreciableAssetsDeduction).toBe(100000);
    expect(result.wearAndTearDeduction).toBe(100000);
    expect(result.operationalDeduction).toBe(30000);
    expect(result.vatInputCredit).toBe(40000);
    expect(result.totalDeduction).toBe(170000);
    expect(result.totalTaxShield).toBe(170000);
  });

  it('handles baseline and boundary edge values correctly', () => {
    const zeroResult = calculateSection11eDepreciation(0, 0, 0);
    expect(zeroResult.totalDeduction).toBe(0);
    expect(zeroResult.depreciableAssetsDeduction).toBe(0);
    expect(zeroResult.operationalDeduction).toBe(0);
    expect(zeroResult.vatInputCredit).toBe(0);
    expect(zeroResult.taxLiabilityReducedPct).toBe(25.0);
  });

  it('calculates the Thomas distributor default case accurately', () => {
    // Baseline from Dashboard: Capital Assets R480,000, Overhead R310,000, Turnover R650,000
    // Assets: 480,000 * 0.20 = 96,000
    // Overhead: 310,000 * 0.15 = 46,500
    // Turnover: 650,000 * 0.05 = 32,500
    // Total: 96,000 + 46,500 + 32,500 = 175,000
    const result = calculateSection11eDepreciation(480000, 310000, 650000);
    expect(result.wearAndTearDeduction).toBe(96000);
    expect(result.operationalDeduction).toBe(46500);
    expect(result.vatInputCredit).toBe(32500);
    expect(result.totalDeduction).toBe(175000);
  });

  it('calculates 15% South African VAT split accurately', () => {
    expect(RSA_STANDARD_VAT_RATE).toBe(0.15);
    const vatCalc = calculateVat(10000);
    expect(vatCalc.vatAmount).toBe(1500);
    expect(vatCalc.totalWithVat).toBe(11500);
  });

  it('applies tiered volume discounts for wholesale bulk orders', () => {
    // 12-pack: 10% discount
    const tier12 = calculateBulkTierDiscount(100, 12, 1);
    expect(tier12.discountRate).toBe(0.10);
    expect(tier12.grossAmount).toBe(1200);
    expect(tier12.discountAmount).toBe(120);
    expect(tier12.netAmount).toBe(1080);

    // 24-pack: 15% discount
    const tier24 = calculateBulkTierDiscount(100, 24, 1);
    expect(tier24.discountRate).toBe(0.15);
    expect(tier24.grossAmount).toBe(2400);
    expect(tier24.discountAmount).toBe(360);
    expect(tier24.netAmount).toBe(2040);

    // 48-pack: 25% discount
    const tier48 = calculateBulkTierDiscount(100, 48, 1);
    expect(tier48.discountRate).toBe(0.25);
    expect(tier48.grossAmount).toBe(4800);
    expect(tier48.discountAmount).toBe(1200);
    expect(tier48.netAmount).toBe(3600);
  });
});
