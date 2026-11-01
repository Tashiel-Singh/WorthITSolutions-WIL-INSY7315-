/**
 * Multi-Channel Revenue Segregation & Profitability Engine
 * Formulated from Role 2 ERP specifications with channel margin analysis.
 */

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

export class RevenueSegregationService {
  // Baseline supply chain cost-basis: 42% for B2B Bulk, 35% for Retail OTC, 30% for Leisure consultations
  private static readonly DEFAULT_COGS_RATIOS: Record<ChannelName, number> = {
    PHARMACY: 0.42,
    PATIENT: 0.35,
    LEISURE: 0.30,
  };

  private static readonly PHARMACIST_COMMISSION_RATE = 0.085; // 8.5% statutory referral fee

  public aggregateRevenueByChannel(records: SalesRecord[]): RevenueBreakdown {
    const byChannel: Record<ChannelName, ChannelMarginMetrics> = {
      PATIENT: { revenue: 0, bulkRevenue: 0, units: 0, cogs: 0, grossProfit: 0, grossMarginPct: 0 },
      PHARMACY: { revenue: 0, bulkRevenue: 0, units: 0, cogs: 0, grossProfit: 0, grossMarginPct: 0 },
      LEISURE: { revenue: 0, bulkRevenue: 0, units: 0, cogs: 0, grossProfit: 0, grossMarginPct: 0 },
    };

    let totalRevenue = 0;
    let totalBulkRevenue = 0;
    let totalCogs = 0;

    for (const r of records) {
      const channel = r.channel;
      if (!byChannel[channel]) continue;

      const amt = Number(r.amount) || 0;
      const bulkAmt = Number(r.bulkRevenue) || 0;
      const qty = Number(r.quantity) || 0;
      const cogs = r.costBasis !== undefined ? r.costBasis : amt * RevenueSegregationService.DEFAULT_COGS_RATIOS[channel];

      byChannel[channel].revenue += amt;
      byChannel[channel].bulkRevenue += bulkAmt;
      byChannel[channel].units += qty;
      byChannel[channel].cogs += cogs;

      totalRevenue += amt;
      totalBulkRevenue += bulkAmt;
      totalCogs += cogs;
    }

    // Compute gross profit & margin percentages per channel
    for (const ch of ['PATIENT', 'PHARMACY', 'LEISURE'] as ChannelName[]) {
      const metrics = byChannel[ch];
      metrics.revenue = Math.round(metrics.revenue * 100) / 100;
      metrics.bulkRevenue = Math.round(metrics.bulkRevenue * 100) / 100;
      metrics.cogs = Math.round(metrics.cogs * 100) / 100;
      metrics.grossProfit = Math.round((metrics.revenue - metrics.cogs) * 100) / 100;
      metrics.grossMarginPct = metrics.revenue > 0
        ? Math.round((metrics.grossProfit / metrics.revenue) * 1000) / 10
        : 0;
    }

    totalRevenue = Math.round(totalRevenue * 100) / 100;
    totalBulkRevenue = Math.round(totalBulkRevenue * 100) / 100;
    totalCogs = Math.round(totalCogs * 100) / 100;
    const totalGrossProfit = Math.round((totalRevenue - totalCogs) * 100) / 100;
    const overallGrossMarginPct = totalRevenue > 0
      ? Math.round((totalGrossProfit / totalRevenue) * 1000) / 10
      : 0;

    // Pharmacist referral commission on chronic patient prescriptions
    const referralCommissionsAccrued = Math.round(byChannel.PATIENT.revenue * RevenueSegregationService.PHARMACIST_COMMISSION_RATE * 100) / 100;

    return {
      byChannel,
      totalRevenue,
      totalBulkRevenue,
      retailRevenue: Math.round((totalRevenue - totalBulkRevenue) * 100) / 100,
      totalCogs,
      totalGrossProfit,
      overallGrossMarginPct,
      referralCommissionsAccrued,
    };
  }
}
