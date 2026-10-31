import { GrowthEngineService } from '../services/GrowthEngineService';

describe('GrowthEngineService (Stochastic Capital Velocity & Kelly Engine)', () => {
  it('computes stochastic simulation and continuous Kelly metrics correctly', () => {
    const report = GrowthEngineService.modelStochasticVelocity({
      initialWorkingCapital: 100000,
      expectedReturnDrift: 0.12,
      cashFlowVolatility: 0.18,
    });

    expect(report.initialWorkingCapital).toBe(100000);
    expect(report.expectedReturnDrift).toBe(0.12);
    expect(report.cashFlowVolatility).toBe(0.18);
    expect(report.optimalKellyAllocationPct).toBeGreaterThan(0);
    expect(report.optimalKellyAllocationPct).toBeLessThanOrEqual(1);
    expect(report.halfKellyAllocationPct).toBeLessThan(report.optimalKellyAllocationPct);
    expect(report.expectedAlphaGenerated).toBeGreaterThan(0);
    expect(report.expectedTerminalCapital).toBeGreaterThan(0);
    expect(report.simulationTrajectories.length).toBe(13); // Start (Month 0) through Month 12
    expect(report.simulationTrajectories[0].mean).toBe(100000);
  });

  it('adjusts Kelly allocation inversely with increasing volatility', () => {
    const lowVol = GrowthEngineService.modelStochasticVelocity({
      initialWorkingCapital: 100000,
      expectedReturnDrift: 0.15,
      cashFlowVolatility: 0.10,
    });

    const highVol = GrowthEngineService.modelStochasticVelocity({
      initialWorkingCapital: 100000,
      expectedReturnDrift: 0.15,
      cashFlowVolatility: 0.35,
    });

    expect(lowVol.optimalKellyAllocationPct).toBeGreaterThan(highVol.optimalKellyAllocationPct);
  });
});
