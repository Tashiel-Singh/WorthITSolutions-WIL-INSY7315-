/**
 * Bulk pricing: tiered volume discount, then 15% South African VAT on the discounted subtotal.
 * Tiers are driven by total units and match the storefront (src/utils/taxCalculations.ts).
 * All maths is in integer cents so VAT is exact to the cent.
 */
import { assertMoney, fromCents, toCents } from '../lib/money';

export interface BulkOrderResult {
  basePrice: number; quantity: number; grossTotal: number; discountRate: number;
  discountAmount: number; subtotalExVat: number; vatAmount: number; totalInclVat: number;
}

export const BULK_TIERS = [
  { minQty: 48, rate: 0.25 },
  { minQty: 24, rate: 0.15 },
  { minQty: 12, rate: 0.1 },
] as const;

export const VAT_RATE = 0.15;

export class BulkOrderCalculationService {
  static readonly VAT_RATE = VAT_RATE;

  static discountRateFor(quantity: number): number {
    for (const t of BULK_TIERS) if (quantity >= t.minQty) return t.rate;
    return 0;
  }

  processBulkOrder(basePrice: number, quantity: number): BulkOrderResult {
    assertMoney(basePrice, 'Base price');
    if (basePrice === 0) throw new RangeError('Base price must be greater than 0');
    if (!Number.isInteger(quantity) || quantity <= 0) throw new RangeError('Quantity must be a positive whole number');

    const grossC = toCents(basePrice) * quantity;
    const discountRate = BulkOrderCalculationService.discountRateFor(quantity);
    const discountC = Math.round(grossC * discountRate);
    const subtotalC = grossC - discountC;
    const vatC = Math.round(subtotalC * VAT_RATE);

    return {
      basePrice, quantity, discountRate,
      grossTotal: fromCents(grossC),
      discountAmount: fromCents(discountC),
      subtotalExVat: fromCents(subtotalC),
      vatAmount: fromCents(vatC),
      totalInclVat: fromCents(subtotalC + vatC),
    };
  }
}
