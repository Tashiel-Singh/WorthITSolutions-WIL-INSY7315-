/**
 * ROLE 2 PLACEHOLDER - replace this file with your teammate's real implementation.
 * Routes depend only on: new RevenueSegregationService().aggregateRevenueByChannel(records)
 */
export type ChannelName = 'PATIENT' | 'PHARMACY' | 'LEISURE';
export interface SalesRecord { channel: ChannelName; amount: number; bulkRevenue: number; quantity: number }
export interface RevenueBreakdown {
  byChannel: Record<ChannelName, { revenue: number; bulkRevenue: number; units: number }>;
  totalRevenue: number;
  totalBulkRevenue: number;
  retailRevenue: number;
}

export class RevenueSegregationService {
  aggregateRevenueByChannel(records: SalesRecord[]): RevenueBreakdown {
    const byChannel = {
      PATIENT: { revenue: 0, bulkRevenue: 0, units: 0 },
      PHARMACY: { revenue: 0, bulkRevenue: 0, units: 0 },
      LEISURE: { revenue: 0, bulkRevenue: 0, units: 0 },
    };
    for (const r of records) {
      byChannel[r.channel].revenue += r.amount;
      byChannel[r.channel].bulkRevenue += r.bulkRevenue;
      byChannel[r.channel].units += r.quantity;
    }
    const totalRevenue = Object.values(byChannel).reduce((s, c) => s + c.revenue, 0);
    const totalBulkRevenue = Object.values(byChannel).reduce((s, c) => s + c.bulkRevenue, 0);
    return { byChannel, totalRevenue, totalBulkRevenue, retailRevenue: totalRevenue - totalBulkRevenue };
  }
}
