/**
 * South African SARS-Compliant Tax & Volume Tier Calculation Utilities
 */

export const RSA_STANDARD_VAT_RATE = 0.15;

/**
 * Calculates tiered discount based on bulk volume
 * 12 units = 10% tier discount
 * 24 units = 15% tier discount
 * 48 units = 25% tier discount
 */
export function calculateBulkTierDiscount(
  unitPrice: number,
  packSize: 12 | 24 | 48,
  packCount: number
): {
  totalUnits: number;
  grossAmount: number;
  discountRate: number;
  discountAmount: number;
  netAmount: number;
  effectiveUnitPrice: number;
} {
  const totalUnits = packSize * packCount;
  const grossAmount = unitPrice * totalUnits;

  let discountRate = 0.10;
  if (packSize === 24) discountRate = 0.15;
  if (packSize === 48) discountRate = 0.25;

  // Additional volume incentive for 5+ cases
  if (packCount >= 5) {
    discountRate += 0.05;
  }

  const discountAmount = grossAmount * discountRate;
  const netAmount = grossAmount - discountAmount;
  const effectiveUnitPrice = totalUnits > 0 ? netAmount / totalUnits : unitPrice;

  return {
    totalUnits,
    grossAmount: Math.round(grossAmount * 100) / 100,
    discountRate,
    discountAmount: Math.round(discountAmount * 100) / 100,
    netAmount: Math.round(netAmount * 100) / 100,
    effectiveUnitPrice: Math.round(effectiveUnitPrice * 100) / 100,
  };
}

/**
 * Calculate standard 15% South African VAT
 */
export function calculateVat(netAmount: number, vatRate = RSA_STANDARD_VAT_RATE): {
  vatAmount: number;
  totalWithVat: number;
} {
  const vatAmount = netAmount * vatRate;
  const totalWithVat = netAmount + vatAmount;

  return {
    vatAmount: Math.round(vatAmount * 100) / 100,
    totalWithVat: Math.round(totalWithVat * 100) / 100,
  };
}

/**
 * Calculates Section 11(e) wear-and-tear depreciation & Section 11(a) operational deductions
 * INSY7315 Task 2 Formula: Total Deduction = (Depreciable Assets * 0.20) + (Operational Expenses * 0.15) + (Bulk Revenue * 0.05 VAT Input)
 */
export function calculateSection11eDepreciation(
  capitalAssets: number,
  operationalExpenses: number,
  bulkTurnover: number
): {
  depreciableAssetsDeduction: number;
  wearAndTearDeduction: number;
  operationalDeduction: number;
  vatInputCredit: number;
  totalDeduction: number;
  totalTaxShield: number;
  taxLiabilityReducedPct: number;
} {
  // 1. Depreciable Assets @ 20% annual write-off rate (SARS Section 11(e))
  const wearAndTearDeduction = capitalAssets * 0.20;
  const depreciableAssetsDeduction = wearAndTearDeduction;

  // 2. Operational Expenses @ 15% qualifying deduction rate (SARS Section 11(a))
  const operationalDeduction = operationalExpenses * 0.15;

  // 3. Bulk Revenue @ 5% VAT Input claim credit
  const vatInputCredit = bulkTurnover * 0.05;

  // Total Tax Deduction Shield
  const totalDeduction = wearAndTearDeduction + operationalDeduction + vatInputCredit;
  const totalTaxShield = totalDeduction;

  const base = capitalAssets + operationalExpenses;
  const rawPct = base > 0 ? (totalTaxShield / base) * 100 : 25.0;
  const taxLiabilityReducedPct = Math.min(45, Math.max(10, Math.round(rawPct * 10) / 10));

  return {
    depreciableAssetsDeduction: Math.round(depreciableAssetsDeduction * 100) / 100,
    wearAndTearDeduction: Math.round(wearAndTearDeduction * 100) / 100,
    operationalDeduction: Math.round(operationalDeduction * 100) / 100,
    vatInputCredit: Math.round(vatInputCredit * 100) / 100,
    totalDeduction: Math.round(totalDeduction * 100) / 100,
    totalTaxShield: Math.round(totalTaxShield * 100) / 100,
    taxLiabilityReducedPct,
  };
}
