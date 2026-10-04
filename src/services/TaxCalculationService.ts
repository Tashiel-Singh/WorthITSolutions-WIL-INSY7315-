export class TaxCalculationError extends Error { constructor(message: string) { super(message); this.name = 'TaxCalculationError'; } }
export interface TaxStrategy { calculate(subtotal: number): number; }
export class StandardVATStrategy implements TaxStrategy {
  calculate(subtotal: number): number {
    if (subtotal < 0) throw new TaxCalculationError('Subtotal cannot be negative.');
    return Number((subtotal * 0.15).toFixed(2));
  }
}
export class WholesaleTaxStrategy implements TaxStrategy {
  calculate(subtotal: number): number {
    if (subtotal < 0) throw new TaxCalculationError('Subtotal cannot be negative.');
    return 0.00;
  }
}
export class TaxCalculationService {
  private strategy: TaxStrategy;
  constructor(initialStrategy: TaxStrategy) { this.strategy = initialStrategy; }
  public setStrategy(strategy: TaxStrategy): void { this.strategy = strategy; }
  public executeTaxCalculation(subtotal: number): number {
    try { return this.strategy.calculate(subtotal); } 
    catch (error) { if (error instanceof TaxCalculationError) throw error; throw new TaxCalculationError('Unexpected error during tax calculation.'); }
  }
}
