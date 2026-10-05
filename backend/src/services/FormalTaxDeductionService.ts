/**
 * ROLE 2 PLACEHOLDER - replace with the real implementation.
 * Formula (WIL doc 3.1.A):
 *   Total = (sum depreciable assets x 0.20) + (sum operational expenses x 0.15) + (bulk revenue x 0.05)
 */
export interface TaxAsset { cost: number; depreciable?: boolean }
export interface TaxExpense { amount: number }
export interface DeductionResult {
  depreciationDeduction: number;
  expenseDeduction: number;
  vatInputDeduction: number;
  totalDeduction: number;
}

export class FormalTaxDeductionService {
  calculateTotalDeduction(assets: TaxAsset[], expenses: TaxExpense[], bulkRevenue = 0): DeductionResult {
    const r = (n: number) => Math.round(n * 100) / 100;
    const depreciationDeduction = r(assets.filter(a => a.depreciable !== false).reduce((s, a) => s + a.cost, 0) * 0.2);
    const expenseDeduction = r(expenses.reduce((s, e) => s + e.amount, 0) * 0.15);
    const vatInputDeduction = r(bulkRevenue * 0.05);
    return { depreciationDeduction, expenseDeduction, vatInputDeduction, totalDeduction: r(depreciationDeduction + expenseDeduction + vatInputDeduction) };
  }
}
