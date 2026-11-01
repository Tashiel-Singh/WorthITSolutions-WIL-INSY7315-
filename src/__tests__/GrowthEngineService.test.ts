// src/__tests__/GrowthEngineService.test.ts
import { GrowthEngineService } from "../services/GrowthEngineService.js";

describe("GrowthEngineService — Stochastic Quantitative Modeling", () => {
  it("computes Kelly allocation and stochastic confidence bounds deterministically", () => {
    const report = GrowthEngineService.modelStochasticVelocity({
      initialWorkingCapital: 500000,
      expectedReturnDrift: 0.40,
      cashFlowVolatility: 0.15,
      riskFreeRate: 0.07,
      cycleDurationDays: 45,
    });

    expect(report.optimalKellyAllocationPct).toBe(100); // Capped at max bounds
    expect(report.compressedCycleDuration).toBeLessThan(45);
    expect(report.sharpeRatioEfficiency).toBe(2.2);
    expect(report.stochasticConfidenceInterval.p95UpperBound).toBeGreaterThan(report.stochasticConfidenceInterval.p5LowerBound);
  });

  it("handles zero cash flow variance gracefully with default Kelly allocation", () => {
    const report = GrowthEngineService.modelStochasticVelocity({
      initialWorkingCapital: 200000,
      expectedReturnDrift: 0.20,
      cashFlowVolatility: 0.0, // Zero variance
      riskFreeRate: 0.05,
      cycleDurationDays: 30,
    });

    expect(report.optimalKellyAllocationPct).toBe(100);
  });

  it("rejects negative financial parameters with strict invariant checks", () => {
    expect(() => {
      GrowthEngineService.modelStochasticVelocity({
        initialWorkingCapital: -100,
        expectedReturnDrift: 0.2,
        cashFlowVolatility: 0.1,
        riskFreeRate: 0.05,
        cycleDurationDays: 30,
      });
    }).toThrow("Quant Engine Error: Parameters violate non-arbitrage or positive capital constraints.");
  });
});