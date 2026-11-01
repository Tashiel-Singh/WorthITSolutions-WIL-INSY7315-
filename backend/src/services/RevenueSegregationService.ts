import { fromCents, toCents } from '../lib/money';

export type ChannelName = 'PATIENT' | 'PHARMACY' | 'LEISURE';

export interface SalesRecord {
  channel: ChannelName;
  amount: number;
  bulkRevenue: number;
  quantity: number;
  costBasis?: number;
}

export interface ChannelMarginMetrics {
  revenue: number;
  bulkRevenue: number;
  units: number;
  cogs: number;
  grossProfit: number;
  grossMarginPct: number;
}

export interface RevenueBreakdown {
  byChannel: Record<ChannelName, ChannelMarginMetrics>;
  totalRevenue: number;
  totalBulkRevenue: number;
  retailRevenue: number;
  totalCogs: number;
  totalGrossProfit: number;
  overallGrossMarginPct: number;
  referralCommissionsAccrued: number;
}

const CHANNELS: ChannelName[] = ['PATIENT', 'PHARMACY', 'LEISURE'];

export class RevenueSegregationService {
  private static readonly DEFAULT_COGS_RATIOS: Record<ChannelName, number> = {
    PHARMACY: 0.42,
    PATIENT: 0.35,
    LEISURE: 0.30,
  };

  private static readonly PHARMACIST_COMMISSION_RATE = 0.085;

  aggregateRevenueByChannel(records: SalesRecord[]): RevenueBreakdown {
    if (!Array.isArray(records)) throw new TypeError('records must be an array');

    const acc: Record<ChannelName, { revenue: number; bulkRevenue: number; units: number; cogs: number }> = {
      PATIENT: { revenue: 0, bulkRevenue: 0, units: 0, cogs: 0 },
      PHARMACY: { revenue: 0, bulkRevenue: 0, units: 0, cogs: 0 },
      LEISURE: { revenue: 0, bulkRevenue: 0, units: 0, cogs: 0 },
    };

    for (const r of records) {
      const c = acc[r.channel];
      if (!c) throw new RangeError(`Unknown revenue channel: ${String(r.channel)}`);

      const revCents = toCents(r.amount);
      const bulkCents = toCents(r.bulkRevenue);
      const cogsCents = r.costBasis !== undefined
        ? toCents(r.costBasis)
        : Math.round(revCents * RevenueSegregationService.DEFAULT_COGS_RATIOS[r.channel]);

      c.revenue += revCents;
      c.bulkRevenue += bulkCents;
      c.units += r.quantity;
      c.cogs += cogsCents;
    }

    let totalC = 0;
    let bulkC = 0;
    let cogsC = 0;

    const byChannel = {} as RevenueBreakdown['byChannel'];
    for (const ch of CHANNELS) {
      const chRev = acc[ch].revenue;
      const chBulk = acc[ch].bulkRevenue;
      const chCogs = acc[ch].cogs;
      const chProfit = chRev - chCogs;
      const chMarginPct = chRev > 0 ? Math.round((chProfit / chRev) * 1000) / 10 : 0;

      totalC += chRev;
      bulkC += chBulk;
      cogsC += chCogs;

      byChannel[ch] = {
        revenue: fromCents(chRev),
        bulkRevenue: fromCents(chBulk),
        units: acc[ch].units,
        cogs: fromCents(chCogs),
        grossProfit: fromCents(chProfit),
        grossMarginPct: chMarginPct,
      };
    }

    const totalGrossProfit = fromCents(totalC - cogsC);
    const overallGrossMarginPct = totalC > 0 ? Math.round(((totalC - cogsC) / totalC) * 1000) / 10 : 0;
    const referralCommissionsAccrued = Math.round(fromCents(acc.PATIENT.revenue) * RevenueSegregationService.PHARMACIST_COMMISSION_RATE * 100) / 100;

    return {
      byChannel,
      totalRevenue: fromCents(totalC),
      totalBulkRevenue: fromCents(bulkC),
      retailRevenue: fromCents(totalC - bulkC),
      totalCogs: fromCents(cogsC),
      totalGrossProfit,
      overallGrossMarginPct,
      referralCommissionsAccrued,
    };
  }
}
