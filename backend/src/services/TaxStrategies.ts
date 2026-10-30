import { assertMoney, toCents } from '../lib/money';

export interface TaxAsset { cost: number; depreciable?: boolean }
export interface TaxExpense { amount: number }
export interface TaxInput { assets: TaxAsset[]; expenses: TaxExpense[]; bulkRevenue: number }

/** Strategy interface: each deduction rule is one interchangeable class. */
export interface ITaxStrategy {
  readonly name: string;
  /** Returns the deduction in whole cents. */
  calculateCents(input: TaxInput): number;
}

export class DepreciationStrategy implements ITaxStrategy {
  readonly name = 'depreciation';
  constructor(private readonly rate = 0.2) {}
  calculateCents(input: TaxInput): number {
    let sum = 0;
    for (const a of input.assets) {
      if (a.depreciable === false) continue;
      assertMoney(a.cost, 'Asset cost');
      sum += toCents(a.cost);
    }
    return Math.round(sum * this.rate);
  }
}

export class OperatingExpenseStrategy implements ITaxStrategy {
  readonly name = 'operating-expenses';
  constructor(private readonly rate = 0.15) {}
  calculateCents(input: TaxInput): number {
    let sum = 0;
    for (const e of input.expenses) {
      assertMoney(e.amount, 'Expense amount');
      sum += toCents(e.amount);
    }
    return Math.round(sum * this.rate);
  }
}

export class BulkVatInputStrategy implements ITaxStrategy {
  readonly name = 'bulk-vat-input';
  constructor(private readonly rate = 0.05) {}
  calculateCents(input: TaxInput): number {
    assertMoney(input.bulkRevenue, 'Bulk revenue');
    return Math.round(toCents(input.bulkRevenue) * this.rate);
  }
}

/** Context: holds the strategies and delegates to them. */
export class TaxCalculator {
  constructor(private readonly strategies: ITaxStrategy[]) {
    if (strategies.length === 0) throw new Error('TaxCalculator needs at least one strategy');
  }
  calculate(input: TaxInput): { parts: Record<string, number>; totalCents: number } {
    const parts: Record<string, number> = {};
    let totalCents = 0;
    for (const s of this.strategies) {
      const c = s.calculateCents(input);
      parts[s.name] = c;
      totalCents += c;
    }
    return { parts, totalCents };
  }
}

export const defaultTaxStrategies = (): ITaxStrategy[] => [
  new DepreciationStrategy(),
  new OperatingExpenseStrategy(),
  new BulkVatInputStrategy(),
];
