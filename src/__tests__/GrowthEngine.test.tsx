import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GrowthEngineService } from '../services/GrowthEngineService';
import { fetchGrowthSimulation } from '../services/growthClient';
import { GrowthDashboard } from '../components/growth/GrowthDashboard';

describe('GrowthEngineService & Quantitative Modeling', () => {
  it('correctly calculates optimal Kelly allocation and expected alpha from stochastic parameters', () => {
    const report = GrowthEngineService.modelStochasticVelocity({
      initialWorkingCapital: 100000,
      expectedReturnDrift: 0.12,
      cashFlowVolatility: 0.18,
    });

    expect(report.initialWorkingCapital).toBe(100000);
    expect(report.expectedReturnDrift).toBe(0.12);
    expect(report.cashFlowVolatility).toBe(0.18);

    // Kelly allocation percentage
    expect(report.optimalKellyAllocationPct).toBeGreaterThan(0);
    expect(report.optimalKellyAllocationPct).toBeLessThanOrEqual(1);

    // Alpha generation
    expect(report.expectedAlphaGenerated).toBeGreaterThan(0);
    expect(report.expectedTerminalCapital).toBeGreaterThan(0);

    // Monte Carlo trajectories
    expect(report.simulationTrajectories.length).toBe(13); // Start + 12 months
    expect(report.simulationTrajectories[0].mean).toBe(100000);
  });

  it('reduces Kelly capital allocation when cash flow volatility spikes', () => {
    const lowRisk = GrowthEngineService.modelStochasticVelocity({
      initialWorkingCapital: 100000,
      expectedReturnDrift: 0.15,
      cashFlowVolatility: 0.10,
    });

    const highRisk = GrowthEngineService.modelStochasticVelocity({
      initialWorkingCapital: 100000,
      expectedReturnDrift: 0.15,
      cashFlowVolatility: 0.35,
    });

    expect(lowRisk.optimalKellyAllocationPct).toBeGreaterThan(highRisk.optimalKellyAllocationPct);
  });
});

describe('fetchGrowthSimulation (Frontend API Client)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches simulation report from backend endpoint or gracefully falls back', async () => {
    const report = await fetchGrowthSimulation({
      initialWorkingCapital: 100000,
      expectedReturnDrift: 0.12,
      cashFlowVolatility: 0.18,
    });

    expect(report).toBeDefined();
    expect(report.optimalKellyAllocationPct).toBeGreaterThan(0);
    expect(typeof report.expectedAlphaGenerated).toBe('number');
  });
});

describe('GrowthDashboard React Component (Step 3 Blueprint)', () => {
  it('renders input controls and runs simulation to display Kelly allocation and Alpha', async () => {
    render(<GrowthDashboard />);

    // Check heading
    expect(screen.getByText(/Stochastic Capital & Kelly Engine/i)).toBeInTheDocument();

    // Check inputs
    expect(screen.getByPlaceholderText('Capital')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Return Drift')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Volatility')).toBeInTheDocument();

    // Check action button
    const executeBtn = await screen.findByRole('button', { name: /Execute Monte Carlo Simulation/i });
    expect(executeBtn).toBeInTheDocument();

    // Click execution button
    fireEvent.click(executeBtn);

    // Wait for report display
    await waitFor(() => {
      expect(screen.getByText(/Optimal Kelly Allocation:/i)).toBeInTheDocument();
      expect(screen.getByText(/Expected Alpha Generated:/i)).toBeInTheDocument();
    });
  });
});
