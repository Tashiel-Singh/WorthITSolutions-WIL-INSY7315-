import { RevenueSegregationService } from '../services/RevenueSegregationService';

describe('Revenue segregation', () => {
  const svc = new RevenueSegregationService();

  it('aggregates by channel and separates bulk from retail', () => {
    const r = svc.aggregateRevenueByChannel([
      { channel: 'PHARMACY', amount: 100, bulkRevenue: 100, quantity: 5 },
      { channel: 'PATIENT', amount: 50, bulkRevenue: 0, quantity: 1 },
      { channel: 'LEISURE', amount: 25, bulkRevenue: 0, quantity: 2 },
    ]);
    expect(r.totalRevenue).toBe(175);
    expect(r.totalBulkRevenue).toBe(100);
    expect(r.retailRevenue).toBe(75);
    expect(r.byChannel.LEISURE.units).toBe(2);
  });
  it('returns zeros for no records', () => {
    expect(svc.aggregateRevenueByChannel([]).totalRevenue).toBe(0);
  });
  it('has no floating point drift', () => {
    const r = svc.aggregateRevenueByChannel([
      { channel: 'PATIENT', amount: 0.1, bulkRevenue: 0, quantity: 1 },
      { channel: 'PATIENT', amount: 0.2, bulkRevenue: 0, quantity: 1 },
    ]);
    expect(r.byChannel.PATIENT.revenue).toBe(0.3);
    expect(r.totalRevenue).toBe(0.3);
  });
  it('rejects unknown channels and non-array input instead of crashing', () => {
    expect(() => svc.aggregateRevenueByChannel([{ channel: 'WHOLESALE' as any, amount: 1, bulkRevenue: 0, quantity: 1 }])).toThrow(RangeError);
    expect(() => svc.aggregateRevenueByChannel(null as any)).toThrow(TypeError);
  });
});
