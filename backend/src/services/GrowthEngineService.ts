/**
 * Quantitative Growth Engine & Stochastic Capital Velocity Service
 * Unifies continuous-time Merton/Kelly working capital allocation,
 * Geometric Brownian Motion (GBM) Monte Carlo simulation paths,
 * and Role 2 ERP stochastic liquidity cycle compression & confidence intervals.
 */

export interface StochasticParams {
  initialWorkingCapital: number;
  expectedReturnDrift: number; // Annualized drift (mu), e.g. 0.12 (12%)
  cashFlowVolatility: number;  // Annualized volatility (sigma), e.g. 0.18 (18%)
  riskFreeRate?: number;       // Annualized risk-free rate, default 0.05 (5%)
  timeHorizonMonths?: number;  // Simulation horizon in months, default 12
  numSimulations?: number;     // Number of Monte Carlo iterations, default 100
  cycleDurationDays?: number;  // Cash conversion cycle in days, default 30
}

export type StochasticLiquidityParams = StochasticParams;

export interface TrajectoryDataPoint {
  month: string;
  monthIndex: number;
  trajectory1: number;
  trajectory2: number;
  trajectory3: number;
  mean: number;
  p10: number;
  p90: number;
}

export interface QuantitativeExecutionReport {
  initialWorkingCapital: number;
  expectedReturnDrift: number;
  cashFlowVolatility: number;
  riskFreeRate: number;
  optimalKellyAllocationPct: number;
  halfKellyAllocationPct: number;
  expectedAlphaGenerated: number;
  expectedTerminalCapital: number;
  projectedAnnualGrowthRate: number;
  sharpeRatio: number;
  sharpeRatioEfficiency: number;
  compressedCycleDuration: number;
  monthlyValueAtRisk95: number;
  probabilityOfRuin: number;
  capitalVelocityScore: number;
  stochasticConfidenceInterval: {
    p95UpperBound: number;
    p5LowerBound: number;
  };
  simulationTrajectories: TrajectoryDataPoint[];
  methodologyNotes: string[];
}

export class GrowthEngineService {
  private static standardNormal(): number {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  public static modelStochasticVelocity(params: StochasticParams): QuantitativeExecutionReport {
    const capital = Number(params.initialWorkingCapital) > 0 ? Number(params.initialWorkingCapital) : 100000;
    const drift = typeof params.expectedReturnDrift === 'number' ? params.expectedReturnDrift : 0.12;
    const volatility = Math.max(0.01, typeof params.cashFlowVolatility === 'number' ? params.cashFlowVolatility : 0.18);
    const r_f = typeof params.riskFreeRate === 'number' ? params.riskFreeRate : 0.05;
    const horizonMonths = Math.min(36, Math.max(3, params.timeHorizonMonths ?? 12));
    const numPaths = Math.min(500, Math.max(20, params.numSimulations ?? 100));
    const cycleDurationDays = Math.max(1, params.cycleDurationDays ?? 30);

    // 1. Logarithmic Cycle Compression (from Role 2 ERP logic)
    const compressionFactor = 1 / (1 + Math.log(Math.max(10, cycleDurationDays) / 10));
    const compressedCycleDuration = Math.max(1, Math.round(cycleDurationDays * compressionFactor));

    // 2. Continuous-time Kelly Criterion
    const variance = volatility * volatility;
    const rawKelly = Math.max(0, (drift - (r_f * 0.5)) / variance);
    const scaledKelly = Math.min(0.95, Math.max(0.05, rawKelly * 0.18));
    const optimalKellyAllocationPct = Math.round(scaledKelly * 10000) / 10000;
    const halfKellyAllocationPct = Math.round((optimalKellyAllocationPct / 2) * 10000) / 10000;

    // 3. Expected Alpha & Sharpe Ratio Efficiency
    const expectedAlphaGenerated = Math.round(capital * drift * optimalKellyAllocationPct);
    const projectedAnnualGrowthRate = Math.round((drift - 0.5 * variance) * 10000) / 10000;
    const sharpeRatio = Math.round(((drift - r_f) / volatility) * 100) / 100;
    const sharpeRatioEfficiency = Number(((drift - r_f) / volatility).toFixed(4));

    // 4. Parametric Confidence Bounds (Role 2 model)
    const timeHorizonYears = horizonMonths / 12;
    const stdError = capital * volatility * Math.sqrt(timeHorizonYears);
    const p95UpperBound = Math.round(capital + expectedAlphaGenerated + (1.96 * stdError));
    const p5LowerBound = Math.max(0, Math.round(capital + expectedAlphaGenerated - (1.96 * stdError)));

    // 5. Value at Risk
    const monthlySigma = volatility / Math.sqrt(12);
    const monthlyMu = drift / 12;
    const varFactor = Math.max(0, (1.645 * monthlySigma) - monthlyMu);
    const monthlyValueAtRisk95 = Math.round(capital * varFactor);

    // 6. Monte Carlo Geometric Brownian Motion Simulation
    const dt = 1 / 12;
    let ruinCount = 0;
    const allPaths: number[][] = Array.from({ length: numPaths }, () => [capital]);

    for (let pathIdx = 0; pathIdx < numPaths; pathIdx++) {
      let currentVal = capital;
      let pathRuined = false;

      for (let m = 1; m <= horizonMonths; m++) {
        const z = this.standardNormal();
        const exponent = (drift - 0.5 * variance) * dt + volatility * Math.sqrt(dt) * z;
        currentVal = Math.max(0, currentVal * Math.exp(exponent));
        allPaths[pathIdx].push(currentVal);

        if (currentVal < capital * 0.5) {
          pathRuined = true;
        }
      }

      if (pathRuined) {
        ruinCount++;
      }
    }

    const probabilityOfRuin = Math.round((ruinCount / numPaths) * 1000) / 1000;

    const simulationTrajectories: TrajectoryDataPoint[] = [];
    for (let m = 0; m <= horizonMonths; m++) {
      const monthValues = allPaths.map(p => p[m]).sort((a, b) => a - b);
      const sum = monthValues.reduce((acc, v) => acc + v, 0);
      const mean = Math.round(sum / monthValues.length);
      const p10 = Math.round(monthValues[Math.floor(monthValues.length * 0.10)]);
      const p90 = Math.round(monthValues[Math.floor(monthValues.length * 0.90)]);

      simulationTrajectories.push({
        month: m === 0 ? 'Start' : `M${m}`,
        monthIndex: m,
        trajectory1: Math.round(allPaths[0][m]),
        trajectory2: Math.round(allPaths[1][m]),
        trajectory3: Math.round(allPaths[2][m]),
        mean,
        p10,
        p90,
      });
    }

    const expectedTerminalCapital = simulationTrajectories[horizonMonths].mean;
    const capitalVelocityScore = Math.min(100, Math.max(10, Math.round((drift / volatility) * 45 + 35)));

    return {
      initialWorkingCapital: capital,
      expectedReturnDrift: drift,
      cashFlowVolatility: volatility,
      riskFreeRate: r_f,
      optimalKellyAllocationPct,
      halfKellyAllocationPct,
      expectedAlphaGenerated,
      expectedTerminalCapital,
      projectedAnnualGrowthRate,
      sharpeRatio,
      sharpeRatioEfficiency,
      compressedCycleDuration,
      monthlyValueAtRisk95,
      probabilityOfRuin,
      capitalVelocityScore,
      stochasticConfidenceInterval: {
        p95UpperBound,
        p5LowerBound,
      },
      simulationTrajectories,
      methodologyNotes: [
        'Continuous-time Merton/Kelly capital allocation scaled for B2B supply chain inventory buffers.',
        'Geometric Brownian Motion (GBM) stochastic diffusion with 100 Monte Carlo execution paths.',
        'Logarithmic cash conversion cycle compression with 95% parametric confidence intervals.',
      ],
    };
  }
}
