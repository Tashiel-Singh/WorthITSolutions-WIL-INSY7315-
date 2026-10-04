/**
 * ROLE 2 PLACEHOLDER - replace with the real implementation.
 * Assumed tiers (packs of 12/24/48): 12+ = 5%, 24+ = 10%, 48+ = 15%. VAT 15% added on discounted subtotal.
 */
export interface BulkOrderResult {
  basePrice: number; quantity: number; grossTotal: number; discountRate: number;
  discountAmount: number; subtotalExVat: number; vatAmount: number; totalInclVat: number;
}

export class BulkOrderCalculationService {
  static readonly VAT_RATE = 0.15;

  processBulkOrder(basePrice: number, quantity: number): BulkOrderResult {
    const r = (n: number) => Math.round(n * 100) / 100;
    const discountRate = quantity >= 48 ? 0.15 : quantity >= 24 ? 0.1 : quantity >= 12 ? 0.05 : 0;
    const grossTotal = r(basePrice * quantity);
    const discountAmount = r(grossTotal * discountRate);
    const subtotalExVat = r(grossTotal - discountAmount);
    const vatAmount = r(subtotalExVat * BulkOrderCalculationService.VAT_RATE);
    return { basePrice, quantity, grossTotal, discountRate, discountAmount, subtotalExVat, vatAmount, totalInclVat: r(subtotalExVat + vatAmount) };
  }
}
