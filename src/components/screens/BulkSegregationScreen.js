/**
 * Screen 6: Inventory Management - Bulk/Retail Segregation
 * Caption: Figure 6: Bulk/Retail Segregation - Separate inventory pools to prevent cannibalization.
 */
import { store } from '../../store/state.js';
import { Icons } from '../common/Icons.js';
import { showToast } from '../common/Toast.js';

export function renderBulkSegregationScreen() {
  const state = store.getState();
  const products = state.products;

  // Selected product to inspect
  let activeProdId = state.activeProductId || 'PRD-101';
  let product = products.find((p) => p.id === activeProdId) || products[0];

  let currentViewMode = 'both'; // 'both' | 'retail' | 'bulk'

  const container = document.createElement('div');
  container.className = 'page-content';

  function renderContent() {
    container.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Inventory Segregation Architecture</h1>
          <p>Strict dual-pool isolation preventing retail sales from consuming reserved clinic supply stock.</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-secondary" id="btn-back-to-stock">
            ← Stock Overview
          </button>
          <button class="btn btn-primary" id="btn-next-screen7">
            Next: Bulk Order Portal →
          </button>
        </div>
      </div>

      <!-- Active Segregation Shield Banner -->
      <div style="padding: 1.15rem 1.5rem; background: var(--color-bulk-bg); border: 1px solid var(--color-bulk-border); border-radius: var(--radius-md); margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div style="display: flex; align-items: center; gap: 0.85rem;">
          <div style="width: 36px; height: 36px; border-radius: var(--radius-xs); background: var(--status-success); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; flex-shrink: 0;">
            ✓
          </div>
          <div>
            <strong style="color: var(--text-primary); font-size: 0.95rem;">
              Segregation Shield Active: Cannibalization Blocked
            </strong>
            <div style="font-size: 0.8125rem; color: var(--text-secondary);">
              Bulk stock reserved for clinics. Retail point-of-sale transactions cannot deduct from the bulk reserve pool.
            </div>
          </div>
        </div>

        <!-- Product Selector Dropdown -->
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span style="font-size: 0.8125rem; color: var(--text-muted); font-weight: 600;">Product:</span>
          <select id="seg-product-select" class="form-select" style="min-width: 260px;">
            ${products
              .map(
                (p) =>
                  `<option value="${p.id}" ${p.id === product.id ? 'selected' : ''}>
                    ${p.name} (${p.category})
                  </option>`
              )
              .join('')}
          </select>
        </div>
      </div>

      <!-- Pool Mode Toggle Switch (All Pools / Retail View / Bulk View) -->
      <div style="display: flex; justify-content: center; margin-bottom: 1.5rem;">
        <div class="theme-switch-group">
          <button class="theme-btn ${currentViewMode === 'both' ? 'active' : ''}" data-view="both">
            Dual Pool View
          </button>
          <button class="theme-btn ${currentViewMode === 'retail' ? 'active' : ''}" data-view="retail">
            Retail Pool Only
          </button>
          <button class="theme-btn ${currentViewMode === 'bulk' ? 'active' : ''}" data-view="bulk">
            Bulk Reserve Pool Only
          </button>
        </div>
      </div>

      <!-- Two Side-by-Side Segregation Columns -->
      <div class="grid-cols-2">
        <!-- Retail Pool Column -->
        ${
          currentViewMode === 'both' || currentViewMode === 'retail'
            ? `
          <div class="card segregation-pool-card" style="border-top: 4px solid #2563eb;">
            <div class="card-header">
              <div>
                <span class="badge badge-retail" style="margin-bottom: 0.35rem;">Retail Stream</span>
                <div class="card-title" style="color: #2563eb;">Retail Store Inventory Pool</div>
                <div class="card-subtitle">Available for walk-in and online single-unit sales</div>
              </div>
              <div class="kpi-icon" style="color: #2563eb;">${Icons.user}</div>
            </div>

            <div style="margin: 1.5rem 0; text-align: center;">
              <div style="font-size: 3.25rem; font-weight: 800; color: #2563eb; line-height: 1;">
                ${product.retailStock}
              </div>
              <div style="font-size: 0.8125rem; color: var(--text-muted); margin-top: 0.35rem;">
                ${product.unit}s available in retail stock
              </div>
            </div>

            <div style="background: var(--bg-surface-subtle); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.25rem; font-size: 0.8125rem; display: flex; flex-direction: column; gap: 0.5rem;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-muted);">Retail Unit Price:</span>
                <strong style="color: var(--text-primary);">R ${product.unitPriceRetail.toFixed(2)}</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-muted);">Packaging:</span>
                <span style="color: var(--text-primary);">${product.unit} (Single)</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-muted);">POS Deductions:</span>
                <span class="badge badge-success">Direct Retail Access</span>
              </div>
            </div>

            <button class="btn btn-secondary btn-sm btn-reorder-retail" style="width: 100%;">
              Restock Retail Pool (+25)
            </button>
          </div>
        `
            : ''
        }

        <!-- Bulk Reserved Pool Column (Locked & Shielded) -->
        ${
          currentViewMode === 'both' || currentViewMode === 'bulk'
            ? `
          <div class="card segregation-pool-card locked" style="border-top: 4px solid #10b981;">
            <div class="card-header">
              <div>
                <span class="badge badge-bulk" style="margin-bottom: 0.35rem;">
                  🔒 Locked & Reserved
                </span>
                <div class="card-title" style="color: #10b981;">B2B Bulk Clinic Inventory Pool</div>
                <div class="card-subtitle">Exclusively reserved for medical practices & clinics</div>
              </div>
              <div class="kpi-icon" style="color: #10b981;">${Icons.shield}</div>
            </div>

            <div style="margin: 1.5rem 0; text-align: center;">
              <div style="font-size: 3.25rem; font-weight: 800; color: #10b981; line-height: 1;">
                ${product.bulkStock}
              </div>
              <div style="font-size: 0.8125rem; color: var(--text-muted); margin-top: 0.35rem;">
                ${product.unit}s reserved for contracted clinic orders
              </div>
            </div>

            <div style="background: var(--bg-card); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.25rem; font-size: 0.8125rem; display: flex; flex-direction: column; gap: 0.5rem; border: 1px solid var(--border-subtle);">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-muted);">B2B Bulk Price (Discounted):</span>
                <strong style="color: #10b981;">R ${product.unitPriceBulk.toFixed(2)}</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-muted);">Wholesale Packaging:</span>
                <span style="color: var(--text-primary); font-weight: 600;">${product.bulkPackaging}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-muted);">Retail POS Protection:</span>
                <span class="badge badge-bulk">Protected Against Depletion</span>
              </div>
            </div>

            <button class="btn btn-primary btn-sm btn-open-bulk-order" style="width: 100%;">
              ${Icons.plus} Place Clinic Bulk Order
            </button>
          </div>
        `
            : ''
        }
      </div>
    `;

    // Listeners
    container.querySelector('#seg-product-select')?.addEventListener('change', (e) => {
      activeProdId = e.target.value;
      product = products.find((p) => p.id === activeProdId) || products[0];
      store.state.activeProductId = activeProdId;
      renderContent();
    });

    container.querySelectorAll('[data-view]').forEach((btn) => {
      btn.addEventListener('click', () => {
        currentViewMode = btn.getAttribute('data-view');
        renderContent();
      });
    });

    container.querySelector('.btn-reorder-retail')?.addEventListener('click', () => {
      store.reorderProduct(product.id, 'retail', 25);
      showToast('Retail Stock Updated', `Added 25 units to ${product.name} (Retail Pool).`, 'success');
    });

    container.querySelector('.btn-open-bulk-order')?.addEventListener('click', () => {
      store.navigateTo('bulk-order');
    });

    container.querySelector('#btn-back-to-stock')?.addEventListener('click', () => {
      store.navigateTo('inventory-overview');
    });

    container.querySelector('#btn-next-screen7')?.addEventListener('click', () => {
      store.navigateTo('bulk-order');
    });
  }

  renderContent();
  return container;
}
