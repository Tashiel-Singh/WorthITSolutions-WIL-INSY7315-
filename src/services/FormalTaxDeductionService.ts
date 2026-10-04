export interface TaxAuditData { depreciableAssets: number[]; operationalExpenses: number[]; bulkRevenue: number; }
export class FormalTaxDeductionService {
  public static calculateTotalDeduction(data: TaxAuditData): number {
    const assetDeduction = data.depreciableAssets.reduce((sum, val) => sum + val, 0) * 0.20;
    const expenseDeduction = data.operationalExpenses.reduce((sum, val) => sum + val, 0) * 0.15;
    const bulkVatInput = data.bulkRevenue * 0.05;
    const totalDeduction = assetDeduction + expenseDeduction + bulkVatInput;
    return Number(totalDeduction.toFixed(2));
  }
}
