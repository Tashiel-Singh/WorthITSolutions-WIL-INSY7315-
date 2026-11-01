/**
 * GoF Strategy Pattern implementation for South African SARS Section 11(e) Tax Deduction Engine.
 * Adapted from Role 2 ERP core logic and backend architecture specifications.
 */

export interface TaxAsset {
  cost: number;
  depreciable?: boolean;
}

export interface TaxExpense {
  amount: number;
}

export interface TaxInput {
  assets: TaxAsset[];
  expenses: TaxExpense[];
  bulkRevenue: number;
}

/** Strategy interface: each statutory deduction rule is an interchangeable class. */
export interface ITaxStrategy {
  readonly name: string;
  readonly description: string;
  readonly statutoryRate: number;
  /** Returns the deduction amount in standard currency units (ZAR). */
  calculate(input: TaxInput): number;
}

/** SARS Section 11(e): 20% Annual Wear-and-Tear Depreciation write-off on capital assets */
export class DepreciationStrategy implements ITaxStrategy {
  readonly name = 'depreciation';
  readonly description = 'SARS Section 11(e) Capital Asset Wear-and-Tear (20% write-off)';
  readonly statutoryRate = 0.20;

  constructor(private readonly rate = 0.20) {}

  calculate(input: TaxInput): number {
    const totalAssets = input.assets
      .filter((a) => a.depreciable !== false)
      .reduce((sum, a) => sum + (Number(a.cost) || 0), 0);
    return Math.round(totalAssets * this.rate * 100) / 100;
  }
}

/** SARS Section 11(a): 15% Qualifying Operational Expenditure overhead deductions */
export class OperatingExpenseStrategy implements ITaxStrategy {
  readonly name = 'operating-expenses';
  readonly description = 'SARS Section 11(a) General Operational Overhead (15% deduction)';
  readonly statutoryRate = 0.15;

  constructor(private readonly rate = 0.15) {}

  calculate(input: TaxInput): number {
    const totalExpenses = input.expenses.reduce(
      (sum, e) => sum + (Number(e.amount) || 0),
      0
    );
    return Math.round(totalExpenses * this.rate * 100) / 100;
  }
}

/** VAT Input Deduction: 5% wholesale bulk turnover claim credit */
export class BulkVatInputStrategy implements ITaxStrategy {
  readonly name = 'bulk-vat-input';
  readonly description = 'B2B Wholesale Turnover VAT Input Credit Claim (5%)';
  readonly statutoryRate = 0.05;

  constructor(private readonly rate = 0.05) {}

  calculate(input: TaxInput): number {
    const bulkTurnover = Number(input.bulkRevenue) || 0;
    return Math.round(bulkTurnover * this.rate * 100) / 100;
  }
}

/** Context: manages strategies and coordinates execution. */
export class TaxCalculator {
  constructor(private readonly strategies: ITaxStrategy[]) {
    if (!strategies || strategies.length === 0) {
      throw new Error('TaxCalculator requires at least one ITaxStrategy.');
    }
  }

  calculate(input: TaxInput): {
    parts: Record<string, number>;
    totalDeduction: number;
    effectiveShieldPct: number;
  } {
    const parts: Record<string, number> = {};
    let totalDeduction = 0;

    for (const strategy of this.strategies) {
      const deduction = strategy.calculate(input);
      parts[strategy.name] = deduction;
      totalDeduction += deduction;
    }

    const totalBase =
      input.assets.reduce((s, a) => s + (Number(a.cost) || 0), 0) +
      input.expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);

    const effectiveShieldPct =
      totalBase > 0
        ? Math.round((totalDeduction / totalBase) * 1000) / 10
        : 25.0;

    return {
      parts,
      totalDeduction: Math.round(totalDeduction * 100) / 100,
      effectiveShieldPct,
    };
  }
}

export const defaultTaxStrategies = (): ITaxStrategy[] => [
  new DepreciationStrategy(),
  new OperatingExpenseStrategy(),
  new BulkVatInputStrategy(),
];
