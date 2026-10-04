/**
 * Screen 3: Financial Management - Tax Deduction Engine
 * Caption: Figure 3: Tax Deduction Engine - Automated calculation of depreciation and operational expense deductions under Section 11(e) and Section 18A.
 */
import { store } from '../../store/state.js';
import { Icons } from '../common/Icons.js';
import { showToast } from '../common/Toast.js';

export function renderTaxEngineScreen() {
  const state = store.getState();
  const tax = state.lastTaxCalculation;

  const container = document.createElement('div');
  container.className = 'page-content';

  function formatCurrency(val) {
    return `R ${(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  const totalDeductions = (tax.depreciationDeduction || 0) + (tax.operationalDeduction || 0) + (tax.vatInputClaim || 0);

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1>Tax Deduction Engine</h1>
        <p>Automated identification of wear-and-tear depreciation, qualifying operational expenses, and VAT input claims.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" id="btn-back-to-dashboard">
          ← Back to Dashboard
        </button>
        <button class="btn btn-primary" id="btn-next-screen4">
          Next: Revenue Segregation →
        </button>
      </div>
    </div>

    <div class="grid-cols-2">
      <!-- Input Parameters Form Card -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">${Icons.shield} Business Financial Parameters</div>
            <div class="card-subtitle">Input balance sheet figures to identify tax shield deductions</div>
          </div>
        </div>

        <form id="tax-calc-form">
          <div class="form-group">
            <label class="form-label" for="input-assets">
              Total Qualifying Capital Assets (R)
              <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: normal;">(Clinic Furniture, Hydraulic Tables, Utility Carts)</span>
            </label>
            <input 
              type="number" 
              id="input-assets" 
              class="form-input" 
              value="${tax.totalAssets}" 
              step="1000" 
              min="0"
              required 
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="input-ops">
              Operational Expenses (R)
              <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: normal;">(Facility Rent, Logistics, Utilities, Staff Salaries)</span>
            </label>
            <input 
              type="number" 
              id="input-ops" 
              class="form-input" 
              value="${tax.operationalExpenses}" 
              step="1000" 
              min="0"
              required 
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="input-bulk-rev">
              Bulk Revenue Stream (R)
              <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: normal;">(For 15% VAT Input Claim & B2B Inventory Credits)</span>
            </label>
            <input 
              type="number" 
              id="input-bulk-rev" 
              class="form-input" 
              value="${tax.bulkRevenue}" 
              step="1000" 
              min="0"
              required 
            />
          </div>

          <!-- Progress Bar (Triggered during calculation) -->
          <div id="calc-progress-box" style="display: none; margin-bottom: 1.25rem;">
            <div style="font-size: 0.75rem; color: var(--color-primary); font-weight: 700; margin-bottom: 0.35rem;">
              Running Tax Algorithm & SARS Depreciation Schedules...
            </div>
            <div style="width: 100%; height: 6px; background: var(--border-subtle); border-radius: var(--radius-full); overflow: hidden;">
              <div id="calc-progress-fill" style="width: 20%; height: 100%; background: var(--color-primary); transition: width 0.4s ease;"></div>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" id="btn-calculate" style="width: 100%; height: 44px;">
            ${Icons.refresh} Calculate Tax Deductions
          </button>
        </form>
      </div>

      <!-- Results Section -->
      <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div class="card-header">
            <div>
              <div class="card-title">${Icons.check} Deduction Analysis Output</div>
              <div class="card-subtitle">Verified tax deductions and liability reduction range</div>
            </div>
          </div>

          <!-- Green Success Banner -->
          <div style="padding: 1.25rem; background: var(--status-success-bg); border: 1px solid var(--status-success-border); border-radius: var(--radius-lg); margin-bottom: 1.25rem; display: flex; align-items: center; gap: 1rem;">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--status-success); color: var(--text-inverse); display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 800; flex-shrink: 0;">
              ✓
            </div>
            <div>
              <div style="font-weight: 800; font-size: 1.15rem; color: var(--status-success);">
                Tax Liability Reduced by <span id="res-reduction-pct">${tax.taxLiabilityReducedPct}%</span>
              </div>
              <div style="font-size: 0.8125rem; color: var(--text-secondary); margin-top: 0.2rem;">
                Estimated qualifying deductions identify <strong id="res-total-pct">${tax.totalDeductionPct}%</strong> across operational and capital asset schedules.
              </div>
            </div>
          </div>

          <!-- Deduction Breakdown Items with Exact Rand Figures -->
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1rem; background: var(--bg-surface-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              <div>
                <strong style="color: var(--text-primary); font-size: 0.9rem;">1. Capital Asset Depreciation (SARS Section 11(e))</strong>
                <div style="font-size: 0.72rem; color: var(--text-muted);">Wear-and-tear deduction on clinical furniture & hydraulic equipment (15% p.a.)</div>
              </div>
              <div style="text-align: right;">
                <div style="font-weight: 800; color: var(--text-primary); font-size: 0.95rem;" id="res-depr-amount">
                  ${formatCurrency(tax.depreciationDeduction)}
                </div>
                <span class="badge badge-info" id="res-depr-badge" style="font-size: 0.65rem;">Qualifying Deduction</span>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1rem; background: var(--bg-surface-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              <div>
                <strong style="color: var(--text-primary); font-size: 0.9rem;">2. Operational Expenses (SARS Section 11(a))</strong>
                <div style="font-size: 0.72rem; color: var(--text-muted);">Rent, distribution logistics, and administrative overheads</div>
              </div>
              <div style="text-align: right;">
                <div style="font-weight: 800; color: var(--status-success); font-size: 0.95rem;" id="res-ops-amount">
                  ${formatCurrency(tax.operationalDeduction)}
                </div>
                <span class="badge badge-success" id="res-ops-badge" style="font-size: 0.65rem;">100% Deductible</span>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1rem; background: var(--bg-surface-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              <div>
                <strong style="color: var(--text-primary); font-size: 0.9rem;">3. VAT Input Tax Credits</strong>
                <div style="font-size: 0.72rem; color: var(--text-muted);">15% VAT reclaimed on bulk clinic supplies and intake</div>
              </div>
              <div style="text-align: right;">
                <div style="font-weight: 800; color: var(--color-primary); font-size: 0.95rem;" id="res-vat-amount">
                  ${formatCurrency(tax.vatInputClaim)}
                </div>
                <span class="badge badge-bulk" id="res-vat-badge" style="font-size: 0.65rem;">15% VAT Credit</span>
              </div>
            </div>

            <!-- Total Deductions Row -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1rem; background: var(--color-primary-bg); border-radius: var(--radius-md); border: 1px solid var(--color-primary-border);">
              <div>
                <strong style="color: var(--color-primary); font-size: 0.95rem;">Total Qualifying Tax Shield</strong>
                <div style="font-size: 0.72rem; color: var(--text-muted);">Cumulative taxable income deductions</div>
              </div>
              <div style="text-align: right;">
                <div style="font-weight: 800; color: var(--color-primary); font-size: 1.1rem;" id="res-total-amount">
                  ${formatCurrency(totalDeductions)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle); font-size: 0.75rem; color: var(--text-muted); display: flex; justify-content: space-between;">
          <span>SARS Compliance Engine v2.4</span>
          <span>Verified: Section 11(e) & Section 11(a)</span>
        </div>
      </div>
    </div>
  `;

  // Form submit & animation
  const form = container.querySelector('#tax-calc-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const assets = container.querySelector('#input-assets').value;
    const ops = container.querySelector('#input-ops').value;
    const bulk = container.querySelector('#input-bulk-rev').value;

    const progBox = container.querySelector('#calc-progress-box');
    const progFill = container.querySelector('#calc-progress-fill');
    const btn = container.querySelector('#btn-calculate');

    progBox.style.display = 'block';
    progFill.style.width = '30%';
    btn.disabled = true;

    setTimeout(() => {
      progFill.style.width = '80%';
    }, 150);

    setTimeout(() => {
      progFill.style.width = '100%';
      const res = store.calculateTaxDeduction(assets, ops, bulk);
      progBox.style.display = 'none';
      btn.disabled = false;

      container.querySelector('#res-reduction-pct').textContent = `${res.taxLiabilityReducedPct}%`;
      container.querySelector('#res-total-pct').textContent = `${res.totalDeductionPct}%`;
      container.querySelector('#res-depr-amount').textContent = formatCurrency(res.depreciationDeduction);
      container.querySelector('#res-ops-amount').textContent = formatCurrency(res.operationalDeduction);
      container.querySelector('#res-vat-amount').textContent = formatCurrency(res.vatInputClaim);
      
      const newTotal = (res.depreciationDeduction || 0) + (res.operationalDeduction || 0) + (res.vatInputClaim || 0);
      container.querySelector('#res-total-amount').textContent = formatCurrency(newTotal);

      showToast(
        'Calculation Complete',
        `Tax Liability Reduced by ${res.taxLiabilityReducedPct}%. Deductions updated.`,
        'success'
      );
    }, 350);
  });

  // Navigation handlers
  container.querySelector('#btn-back-to-dashboard')?.addEventListener('click', () => {
    store.navigateTo('dashboard');
  });

  container.querySelector('#btn-next-screen4')?.addEventListener('click', () => {
    store.navigateTo('revenue-segregation');
  });

  return container;
}
