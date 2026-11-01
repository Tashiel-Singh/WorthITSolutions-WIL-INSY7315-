// src/services/GrowthEngineService.ts

export interface StochasticLiquidityParams {
  initialWorkingCapital: number;
  expectedReturnDrift: number;     // Annualized expected return on reinvested capital (e.g., 0.35)
  cashFlowVolatility: number;      // Standard deviation of cash conversion cycle (e.g., 0.18)
  riskFreeRate: number;            // Baseline short-term rate (e.g., 0.07)
  cycleDurationDays: number;       // Current cash conversion cycle length
}

export interface QuantitativeExecutionReport {
  expectedAlphaGenerated: number;
  optimalKellyAllocationPct: number;
  compressedCycleDuration: number;
  sharpeRatioEfficiency: number;
  stochasticConfidenceInterval: {
    p95UpperBound: number;
    p5LowerBound: number;
  };
}

export class GrowthEngineService {
  /**
   * Executes a stochastic cash-flow velocity model. Applies mean-variance optimization
   * and Kelly fraction sizing to maximize compounding top-line growth without liquidity ruin.
   */
  public static modelStochasticVelocity(params: StochasticLiquidityParams): QuantitativeExecutionReport {
    if (params.initialWorkingCapital <= 0 || params.cashFlowVolatility < 0 || params.cycleDurationDays <= 0) {
      throw new Error("Quant Engine Error: Parameters violate non-arbitrage or positive capital constraints.");
    }

    // 1. Compress the cash conversion cycle via automated ledger settlement (bounded logarithmic decay)
    const compressionFactor = 1 / (1 + Math.log(params.cycleDurationDays / 10));
    const compressedCycleDuration = Math.max(1, Math.round(params.cycleDurationDays * compressionFactor));

    // 2. Compute optimal capital allocation fraction using a modified continuous Kelly Criterion
    // f* = (Expected Return - Risk-Free Rate) / Variance
    const excessReturn = params.expectedReturnDrift - params.riskFreeRate;
    const variance = Math.pow(params.cashFlowVolatility, 2);
    const optimalKellyAllocationPct = variance === 0 ? 1.0 : Math.max(0.1, Math.min(1.0, excessReturn / variance));

    // 3. Model continuous compounding expected alpha over the compressed cycle horizon
    const timeHorizonYears = compressedCycleDuration / 365;
    const continuousDrift = params.expectedReturnDrift - 0.5 * variance;
    const expectedAlphaGenerated = Number(
      (params.initialWorkingCapital * optimalKellyAllocationPct * (Math.exp(continuousDrift * timeHorizonYears) - 1)).toFixed(2)
    );

    // 4. Calculate Risk-Adjusted Sharpe Ratio Efficiency
    const sharpeRatioEfficiency = Number((excessReturn / Math.max(0.01, params.cashFlowVolatility)).toFixed(4));

    // 5. Parametric Monte Carlo 95% confidence bounds (Normal approximation)
    const stdError = params.initialWorkingCapital * params.cashFlowVolatility * Math.sqrt(timeHorizonYears);
    const p95UpperBound = Number((params.initialWorkingCapital + expectedAlphaGenerated + (1.96 * stdError)).toFixed(2));
    const p5LowerBound = Number((params.initialWorkingCapital + expectedAlphaGenerated - (1.96 * stdError)).toFixed(2));

    return {
      expectedAlphaGenerated,
      optimalKellyAllocationPct: Number((optimalKellyAllocationPct * 100).toFixed(2)),
      compressedCycleDuration,
      sharpeRatioEfficiency,
      stochasticConfidenceInterval: {
        p95UpperBound,
        p5LowerBound,
      },
    };
  }
}