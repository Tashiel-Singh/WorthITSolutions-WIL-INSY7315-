export class BulkOrderCalculationService {
  public static processBulkOrder(basePrice: number, quantity: number): { discountApplied: number; finalTotal: number; vatAmount: number } {
    let discountRate = 0;
    if (quantity >= 50) discountRate = 0.15;
    else if (quantity >= 20) discountRate = 0.10;
    const subtotal = basePrice * quantity;
    const discountApplied = subtotal * discountRate;
    const discountedTotal = subtotal - discountApplied;
    const vatAmount = discountedTotal * 0.15;
    const finalTotal = discountedTotal + vatAmount;
    return {
      discountApplied: Number(discountApplied.toFixed(2)),
      finalTotal: Number(finalTotal.toFixed(2)),
      vatAmount: Number(vatAmount.toFixed(2)),
    };
  }
}
