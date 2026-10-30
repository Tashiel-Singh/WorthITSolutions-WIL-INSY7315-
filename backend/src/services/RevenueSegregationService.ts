import { fromCents, toCents } from '../lib/money';

export type ChannelName = 'PATIENT' | 'PHARMACY' | 'LEISURE';
export interface SalesRecord { channel: ChannelName; amount: number; bulkRevenue: number; quantity: number }
export interface RevenueBreakdown {
  byChannel: Record<ChannelName, { revenue: number; bulkRevenue: number; units: number }>;
  totalRevenue: number;
  totalBulkRevenue: number;
  retailRevenue: number;
}

const CHANNELS: ChannelName[] = ['PATIENT', 'PHARMACY', 'LEISURE'];

export class RevenueSegregationService {
  aggregateRevenueByChannel(records: SalesRecord[]): RevenueBreakdown {
    if (!Array.isArray(records)) throw new TypeError('records must be an array');
    const acc: Record<ChannelName, { revenue: number; bulkRevenue: number; units: number }> = {
      PATIENT: { revenue: 0, bulkRevenue: 0, units: 0 },
      PHARMACY: { revenue: 0, bulkRevenue: 0, units: 0 },
      LEISURE: { revenue: 0, bulkRevenue: 0, units: 0 },
    };
    for (const r of records) {
      const c = acc[r.channel];
      if (!c) throw new RangeError(`Unknown revenue channel: ${String(r.channel)}`);
      c.revenue += toCents(r.amount);
      c.bulkRevenue += toCents(r.bulkRevenue);
      c.units += r.quantity;
    }
    let totalC = 0;
    let bulkC = 0;
    const byChannel = {} as RevenueBreakdown['byChannel'];
    for (const ch of CHANNELS) {
      totalC += acc[ch].revenue;
      bulkC += acc[ch].bulkRevenue;
      byChannel[ch] = { revenue: fromCents(acc[ch].revenue), bulkRevenue: fromCents(acc[ch].bulkRevenue), units: acc[ch].units };
    }
    return { byChannel, totalRevenue: fromCents(totalC), totalBulkRevenue: fromCents(bulkC), retailRevenue: fromCents(totalC - bulkC) };
  }
}
