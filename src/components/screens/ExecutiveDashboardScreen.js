/**
 * Screen 11: Executive Dashboard (Sprint 6 - Final Deliverable)
 * Caption: Figure 11: Executive Dashboard - Complete overview of all improvements across financial, inventory, and operational areas.
 */
import { store } from '../../store/state.js';
import { Icons } from '../common/Icons.js';
import { showToast } from '../common/Toast.js';

export function renderExecutiveDashboardScreen() {
  const container = document.createElement('div');
  container.className = 'page-content';

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1>Executive Summary & Performance Dashboard</h1>
        <p>Comprehensive evaluation of quantifiable business improvements across Financial, Inventory, and Operational streams.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" id="btn-back-dashboard">
          ← Dashboard
        </button>
        <button class="btn btn-primary" id="btn-download-exec-report">
          ${Icons.records} Download Executive Report (PDF)
        </button>
      </div>
    </div>

    <!-- 3 Stacked Executive Sections (Financial, Inventory, Operational) -->
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      <!-- 1. Top Section: Financial Improvements -->
      <div class="card" style="border-left: 5px solid var(--color-primary);">
        <div class="card-header">
          <div>
            <span class="badge badge-success" style="margin-bottom: 0.35rem;">STREAM 1: FINANCIAL OPTIMIZATION</span>
            <div class="card-title" style="font-size: 1.15rem;">Revenue Growth & Tax Liability Reductions</div>
          </div>
          <button class="btn btn-sm btn-secondary" id="btn-goto-s3-s4">Financial Details →</button>
        </div>

        <div class="grid-cols-3" style="margin-bottom: 0;">
          <!-- Financial Metric 1 -->
          <div style="background: var(--bg-surface-subtle); border-radius: var(--radius-sm); padding: 1.25rem; border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.78125rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">
              Revenue Growth
            </div>
            <div style="font-size: 2.25rem; font-weight: 800; color: var(--status-success); line-height: 1.2; margin: 0.35rem 0;">
              +45%
            </div>
            <div style="font-size: 0.8125rem; color: var(--status-success); font-weight: 600;">
              ↑ Consistent expansion vs May 2026 baseline
            </div>
          </div>

          <!-- Financial Metric 2 -->
          <div style="background: var(--bg-surface-subtle); border-radius: var(--radius-sm); padding: 1.25rem; border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.78125rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">
              Tax Liability Reduction
            </div>
            <div style="font-size: 2.25rem; font-weight: 800; color: var(--color-primary); line-height: 1.2; margin: 0.35rem 0;">
              20%+
            </div>
            <div style="font-size: 0.8125rem; color: var(--status-success); font-weight: 600;">
              ↑ Accelerated depreciation & VAT input credits
            </div>
          </div>

          <!-- Financial Metric 3 -->
          <div style="background: var(--bg-surface-subtle); border-radius: var(--radius-sm); padding: 1.25rem; border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.78125rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">
              Bulk B2B Stream Contribution
            </div>
            <div style="font-size: 2.25rem; font-weight: 800; color: var(--text-primary); line-height: 1.2; margin: 0.35rem 0;">
              55%
            </div>
            <div style="font-size: 0.8125rem; color: var(--text-secondary);">
              Dominant revenue stream from clinics & health groups
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Middle Section: Inventory Improvements -->
      <div class="card" style="border-left: 5px solid var(--color-bulk);">
        <div class="card-header">
          <div>
            <span class="badge badge-bulk" style="margin-bottom: 0.35rem;">STREAM 2: INVENTORY & SEGREGATION</span>
            <div class="card-title" style="font-size: 1.15rem;">Elimination of Cannibalization & Stockout Prevention</div>
          </div>
          <button class="btn btn-sm btn-secondary" id="btn-goto-s5-s6">Inventory Details →</button>
        </div>

        <div class="grid-cols-3" style="margin-bottom: 0;">
          <!-- Inventory Metric 1 -->
          <div style="background: var(--bg-surface-subtle); border-radius: var(--radius-sm); padding: 1.25rem; border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.78125rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">
              Stockouts Reduction
            </div>
            <div style="font-size: 2.25rem; font-weight: 800; color: var(--status-success); line-height: 1.2; margin: 0.35rem 0;">
              -60%+
            </div>
            <div style="font-size: 0.8125rem; color: var(--status-success); font-weight: 600;">
              ✓ Protected reserved pools eliminate stock depletion
            </div>
          </div>

          <!-- Inventory Metric 2 -->
          <div style="background: var(--bg-surface-subtle); border-radius: var(--radius-sm); padding: 1.25rem; border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.78125rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">
              Overstocking Reduction
            </div>
            <div style="font-size: 2.25rem; font-weight: 800; color: var(--status-success); line-height: 1.2; margin: 0.35rem 0;">
              -40%+
            </div>
            <div style="font-size: 0.8125rem; color: var(--status-success); font-weight: 600;">
              ✓ Demand-driven replenishment parameters
            </div>
          </div>

          <!-- Inventory Metric 3 -->
          <div style="background: var(--bg-surface-subtle); border-radius: var(--radius-sm); padding: 1.25rem; border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.78125rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">
              Inventory Turnover Rate
            </div>
            <div style="font-size: 2.25rem; font-weight: 800; color: var(--text-primary); line-height: 1.2; margin: 0.35rem 0;">
              4.2x
            </div>
            <div style="font-size: 0.8125rem; color: var(--status-success); font-weight: 600;">
              ↑ Enhanced liquidity and reduced holding costs
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Bottom Section: Operational Efficiency -->
      <div class="card" style="border-left: 5px solid #f59e0b;">
        <div class="card-header">
          <div>
            <span class="badge badge-warning" style="margin-bottom: 0.35rem;">STREAM 3: OPERATIONAL EXCELLENCE</span>
            <div class="card-title" style="font-size: 1.15rem;">Workflow Automation & Rapid Cash Collections</div>
          </div>
          <button class="btn btn-sm btn-secondary" id="btn-goto-s8-s10">Operations Details →</button>
        </div>

        <div class="grid-cols-3" style="margin-bottom: 0;">
          <!-- Operational Metric 1 -->
          <div style="background: var(--bg-surface-subtle); border-radius: var(--radius-md); padding: 1.25rem; border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.78125rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">
              Invoicing Generation Time
            </div>
            <div style="font-size: 2.25rem; font-weight: 800; color: #f59e0b; line-height: 1.2; margin: 0.35rem 0;">
              -70%
            </div>
            <div style="font-size: 0.8125rem; color: var(--status-success); font-weight: 600;">
              ✓ Generated automatically upon order placement
            </div>
          </div>

          <!-- Operational Metric 2 -->
          <div style="background: var(--bg-surface-subtle); border-radius: var(--radius-md); padding: 1.25rem; border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.78125rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">
              Late Payments Reduction
            </div>
            <div style="font-size: 2.25rem; font-weight: 800; color: #f59e0b; line-height: 1.2; margin: 0.35rem 0;">
              -30%
            </div>
            <div style="font-size: 0.8125rem; color: var(--status-success); font-weight: 600;">
              ✓ Multi-stage automated payment reminders
            </div>
          </div>

          <!-- Operational Metric 3 -->
          <div style="background: var(--bg-surface-subtle); border-radius: var(--radius-md); padding: 1.25rem; border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.78125rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase;">
              Administrative Time Saved
            </div>
            <div style="font-size: 2.25rem; font-weight: 800; color: var(--text-primary); line-height: 1.2; margin: 0.35rem 0;">
              -40%
            </div>
            <div style="font-size: 0.8125rem; color: var(--status-success); font-weight: 600;">
              ✓ Automated calculation and cross-department syncing
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Listeners
  container.querySelector('#btn-download-exec-report')?.addEventListener('click', () => {
    showToast(
      'Executive Report Generated',
      'Sprint 6 final PDF compilation generated (simulated export).',
      'success'
    );
  });

  container.querySelector('#btn-back-dashboard')?.addEventListener('click', () => {
    store.navigateTo('dashboard');
  });

  container.querySelector('#btn-goto-s3-s4')?.addEventListener('click', () => {
    store.navigateTo('revenue-segregation');
  });

  container.querySelector('#btn-goto-s5-s6')?.addEventListener('click', () => {
    store.navigateTo('bulk-segregation');
  });

  container.querySelector('#btn-goto-s8-s10')?.addEventListener('click', () => {
    store.navigateTo('payment-reminders');
  });

  return container;
}
