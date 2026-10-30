/**
 * Tax deduction engine (WIL doc 3.1.A):
 *   Total = (sum depreciable assets x 0.20) + (sum operational expenses x 0.15) + (bulk revenue x 0.05)
 * Implemented with the Strategy pattern (see TaxStrategies.ts). Public API is unchanged.
 */
import { fromCents } from '../lib/money';
import { ITaxStrategy, TaxAsset, TaxCalculator, TaxExpense, defaultTaxStrategies } from './TaxStrategies';

export type { TaxAsset, TaxExpense } from './TaxStrategies';

export interface DeductionResult {
  depreciationDeduction: number;
  expenseDeduction: number;
  vatInputDeduction: number;
  totalDeduction: number;
}

export class FormalTaxDeductionService {
  private readonly calculator: TaxCalculator;

  constructor(strategies: ITaxStrategy[] = defaultTaxStrategies()) {
    this.calculator = new TaxCalculator(strategies);
  }

  calculateTotalDeduction(assets: TaxAsset[], expenses: TaxExpense[], bulkRevenue = 0): DeductionResult {
    if (!Array.isArray(assets) || !Array.isArray(expenses)) {
      throw new TypeError('assets and expenses must be arrays');
    }
    const { parts, totalCents } = this.calculator.calculate({ assets, expenses, bulkRevenue });
    return {
      depreciationDeduction: fromCents(parts['depreciation'] ?? 0),
      expenseDeduction: fromCents(parts['operating-expenses'] ?? 0),
      vatInputDeduction: fromCents(parts['bulk-vat-input'] ?? 0),
      totalDeduction: fromCents(totalCents),
    };
  }
}
