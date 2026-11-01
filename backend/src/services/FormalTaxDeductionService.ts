import {
  ITaxStrategy,
  TaxAsset,
  TaxExpense,
  TaxInput,
  TaxCalculator,
  defaultTaxStrategies,
} from './TaxStrategies';

export type { TaxAsset, TaxExpense, TaxInput, ITaxStrategy };

export interface DeductionResult {
  depreciationDeduction: number;
  expenseDeduction: number;
  vatInputDeduction: number;
  totalDeduction: number;
  effectiveShieldPct: number;
}

export class FormalTaxDeductionService {
  private readonly calculator: TaxCalculator;

  constructor(strategies: ITaxStrategy[] = defaultTaxStrategies()) {
    this.calculator = new TaxCalculator(strategies);
  }

  calculateTotalDeduction(
    assets: TaxAsset[],
    expenses: TaxExpense[],
    bulkRevenue = 0
  ): DeductionResult {
    if (!Array.isArray(assets) || !Array.isArray(expenses)) {
      throw new TypeError('Assets and expenses must be provided as arrays.');
    }

    const { parts, totalDeduction, effectiveShieldPct } =
      this.calculator.calculate({ assets, expenses, bulkRevenue });

    return {
      depreciationDeduction: parts['depreciation'] ?? 0,
      expenseDeduction: parts['operating-expenses'] ?? 0,
      vatInputDeduction: parts['bulk-vat-input'] ?? 0,
      totalDeduction,
      effectiveShieldPct,
    };
  }
}
