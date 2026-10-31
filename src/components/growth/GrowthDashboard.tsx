import { useState, useEffect } from 'react';
import { fetchGrowthSimulation, QuantitativeExecutionReport } from '../../services/growthClient';
import {
  TrendingUp,
  Activity,
  Sliders,
  DollarSign,
  Zap,
  BarChart2,
  RefreshCw,
  Info,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export function GrowthDashboard() {
  const [capital, setCapital] = useState<number>(100000);
  const [drift, setDrift] = useState<number>(0.12);
  const [volatility, setVolatility] = useState<number>(0.18);
  const [report, setReport] = useState<QuantitativeExecutionReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('balanced');

  const handleRunSimulation = async () => {
    setIsLoading(true);
    try {
      const data = await fetchGrowthSimulation({
        initialWorkingCapital: capital,
        expectedReturnDrift: drift,
        cashFlowVolatility: volatility,
      });
      setReport(data);
    } catch (err) {
      console.error('Failed to run growth simulation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial simulation on mount
  useEffect(() => {
    handleRunSimulation();
  }, []);

  const applyPreset = (preset: 'conservative' | 'balanced' | 'aggressive' | 'stress') => {
    setSelectedPreset(preset);
    if (preset === 'conservative') {
      setCapital(150000);
      setDrift(0.08);
      setVolatility(0.09);
    } else if (preset === 'balanced') {
      setCapital(100000);
      setDrift(0.12);
      setVolatility(0.18);
    } else if (preset === 'aggressive') {
      setCapital(80000);
      setDrift(0.24);
      setVolatility(0.22);
    } else if (preset === 'stress') {
      setCapital(100000);
      setDrift(0.05);
      setVolatility(0.35);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>Quantitative Financial Architecture • Step 3 Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <TrendingUp className="w-8 h-8 text-emerald-400" />
              Stochastic Capital & Kelly Engine
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Continuous-time capital velocity simulation with Geometric Brownian Motion (GBM) diffusion,
              Merton-Kelly optimal inventory sizing, and 95% Parametric Value-at-Risk modeling.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRunSimulation}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-bold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing Paths...</span>
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  <span>Execute Monte Carlo Simulation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls & KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Input Controls Panel */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              Stochastic Risk Controls
            </h2>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
              Real-Time
            </span>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Market Scenario Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'conservative', label: 'Conservative' },
                { id: 'balanced', label: 'Balanced' },
                { id: 'aggressive', label: 'Aggressive' },
                { id: 'stress', label: 'Stress Market' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p.id as any)}
                  className={`text-xs py-2 px-3 rounded-lg border font-medium transition-all ${
                    selectedPreset === p.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Inputs Section */}
          <div className="space-y-4">
            {/* Initial Working Capital */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  Initial Working Capital ($ / ZAR)
                </span>
                <span className="font-mono text-emerald-700 font-bold">
                  ${capital.toLocaleString()}
                </span>
              </div>
              <input
                type="number"
                min={1000}
                step={5000}
                value={capital}
                onChange={(e) => setCapital(Math.max(0, Number(e.target.value)))}
                placeholder="Capital"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm text-slate-900 bg-white"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Liquidity base deployed into wholesale bulk inventories.
              </span>
            </div>

            {/* Expected Return Drift (mu) */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Expected Return Drift (&mu;)</span>
                <span className="font-mono font-bold text-indigo-600">
                  {(drift * 100).toFixed(1)}% p.a.
                </span>
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1.0"
                value={drift}
                onChange={(e) => setDrift(Number(e.target.value))}
                placeholder="Return Drift"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm text-slate-900 bg-white mb-2"
              />
              <input
                type="range"
                min="0.01"
                max="0.40"
                step="0.005"
                value={drift}
                onChange={(e) => setDrift(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Annualized expected inventory turnover margin growth.
              </span>
            </div>

            {/* Cash Flow Volatility (sigma) */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Cash Flow Volatility (&sigma;)</span>
                <span className="font-mono font-bold text-amber-600">
                  {(volatility * 100).toFixed(1)}% p.a.
                </span>
              </div>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="1.0"
                value={volatility}
                onChange={(e) => setVolatility(Math.max(0.01, Number(e.target.value)))}
                placeholder="Volatility"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm text-slate-900 bg-white mb-2"
              />
              <input
                type="range"
                min="0.02"
                max="0.50"
                step="0.005"
                value={volatility}
                onChange={(e) => setVolatility(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Standard deviation of wholesale sales velocity and lead-time delays.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRunSimulation}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Recalculate Stochastic Model</span>
          </button>
        </div>

        {/* Right Column (2 spans): Quantitative Results Display */}
        <div className="lg:col-span-2 space-y-6">
          {/* Headline Results Blueprint Card */}
          {report && (
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Quantitative Execution Report
                </span>
                <span className="text-xs font-mono bg-slate-800 px-2.5 py-1 rounded-full text-slate-300 border border-slate-700">
                  Velocity Score: {report.capitalVelocityScore}/100
                </span>
              </div>

              {/* Exact blueprint outputs */}
              <div className="mb-4 p-4 bg-slate-800 rounded border border-slate-700">
                <p><strong>Optimal Kelly Allocation:</strong> {(report.optimalKellyAllocationPct * 100).toFixed(2)}%</p>
                <p><strong>Expected Alpha Generated:</strong> ${report.expectedAlphaGenerated.toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/90 rounded-xl border border-slate-700/80">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
                    Optimal Kelly Allocation
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 font-mono">
                    {(report.optimalKellyAllocationPct * 100).toFixed(2)}%
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">
                    Continuous Kelly fraction: ${(report.optimalKellyAllocationPct * capital).toLocaleString()} optimal working capital deployment.
                  </p>
                </div>

                <div className="p-4 bg-slate-800/90 rounded-xl border border-slate-700/80">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">
                    Expected Alpha Generated
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-indigo-400 mt-1 font-mono">
                    ${report.expectedAlphaGenerated.toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">
                    Net surplus return over baseline capital cost at ${capital.toLocaleString()} initial liquidity.
                  </p>
                </div>
              </div>

              {/* Auxiliary Risk Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block">Terminal Wealth (M12)</span>
                  <span className="font-mono font-bold text-white text-sm">
                    ${report.expectedTerminalCapital.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Geometric Growth (g)</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {(report.projectedAnnualGrowthRate * 100).toFixed(2)}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Sharpe Ratio</span>
                  <span className="font-mono font-bold text-white text-sm">
                    {report.sharpeRatio}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Monthly 95% VaR</span>
                  <span className="font-mono font-bold text-rose-400 text-sm">
                    -${report.monthlyValueAtRisk95.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Monte Carlo Stochastic Simulation Chart */}
          {report && report.simulationTrajectories && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-emerald-600" />
                    Stochastic Capital Velocity Trajectories (12-Month GBM Diffusion)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Geometric Brownian Motion paths with expected drift (&mu; = {(drift * 100).toFixed(0)}%) and volatility (&sigma; = {(volatility * 100).toFixed(0)}%).
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <span className="w-3 h-1 bg-emerald-600 rounded-full inline-block" /> Mean Path
                  </span>
                  <span className="flex items-center gap-1.5 text-indigo-700 font-semibold">
                    <span className="w-3 h-1 bg-indigo-500 rounded-full inline-block" /> P90 Bull
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
                    <span className="w-3 h-1 bg-amber-500 rounded-full inline-block" /> P10 Stress
                  </span>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={report.simulationTrajectories}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '0.75rem',
                        color: '#f8fafc',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Line
                      type="monotone"
                      dataKey="mean"
                      name="Expected Mean (E[W_t])"
                      stroke="#059669"
                      strokeWidth={3}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="p90"
                      name="90th Percentile (Upper Bound)"
                      stroke="#6366f1"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="p10"
                      name="10th Percentile (Stress Case)"
                      stroke="#f59e0b"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="trajectory1"
                      name="Monte Carlo Path 1"
                      stroke="#94a3b8"
                      strokeWidth={1}
                      dot={false}
                      opacity={0.6}
                    />
                    <Line
                      type="monotone"
                      dataKey="trajectory2"
                      name="Monte Carlo Path 2"
                      stroke="#cbd5e1"
                      strokeWidth={1}
                      dot={false}
                      opacity={0.6}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Mathematical Methodology Card */}
              <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-semibold text-slate-800">
                    Merton Continuous-Time Kelly Formulation:
                  </p>
                  <p className="font-mono text-[11px] text-slate-700">
                    f* = (&mu; - r) / &sigma;&sup2; &bull; dS = &mu;S dt + &sigma;S dW
                  </p>
                  <p className="text-[11px] text-slate-500">
                    The Kelly criterion maximizes the expected long-run geometric growth rate while penalizing variance drag (&frac12;&sigma;&sup2;). In supply chain operations, this guarantees sufficient wholesale inventory buffer without risking working capital insolvency.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GrowthDashboard;
