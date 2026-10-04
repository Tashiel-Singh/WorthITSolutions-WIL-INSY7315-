export type SalesChannel = 'PATIENT' | 'PHARMACY' | 'LEISURE';
export interface Transaction { id: string; channel: SalesChannel; amount: number; }
export class RevenueSegregationService {
  public static aggregateRevenueByChannel(transactions: Transaction[]): Record<SalesChannel, number> {
    const breakdown: Record<SalesChannel, number> = { PATIENT: 0, PHARMACY: 0, LEISURE: 0 };
    for (const tx of transactions) {
      if (breakdown[tx.channel] !== undefined) {
        breakdown[tx.channel] += tx.amount;
      }
    }
    return breakdown;
  }
}
