/**
 * Screen 6: Inventory Management - Bulk/Retail Segregation
 * Caption: Figure 6: Bulk/Retail Segregation - Separate inventory pools to prevent cannibalization with transfer audit trail.
 */
import { store } from '../../store/state.js';
import { Icons } from '../common/Icons.js';
import { openModal } from '../common/Modal.js';
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

  function openTransferModal(selectedProd) {
    const prod = selectedProd || product;

    openModal({
      title: `Stock Segregation Transfer: Bulk → Retail Pool`,
      contentHtml: `
        <div style="margin-bottom: 1.25rem; padding: 0.85rem 1rem; background: var(--bg-surface-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-subtle); font-size: 0.8125rem;">
          <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">
            ${prod.name} (${prod.category})
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 0.35rem;">
            <span>Current Bulk Reserve: <strong style="color: var(--color-primary);">${prod.bulkStock} ${prod.unit}s</strong></span>
            <span>Current Retail Store: <strong style="color: var(--color-retail);">${prod.retailStock} ${prod.unit}s</strong></span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Units to Transfer from Bulk to Retail</label>
          <input 
            type="number" 
            id="modal-transfer-qty" 
            class="form-input" 
            value="${Math.min(25, prod.bulkStock)}" 
            min="1" 
            max="${prod.bulkStock}" 
            required 
          />
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.25rem;">
            Maximum units available in bulk reserve: ${prod.bulkStock} ${prod.unit}s.
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Reallocation Authorization & Operational Reason</label>
          <select id="modal-transfer-reason" class="form-select">
            <option value="Front desk retail shelf restock">Front desk retail shelf restock</option>
            <option value="Urgent walk-in OTC patient demand">Urgent walk-in OTC patient demand</option>
            <option value="Display / Showroom sample setup">Display / Showroom sample setup</option>
            <option value="Routine end-of-week inventory rebalancing">Routine end-of-week inventory rebalancing</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Additional Operator Notes</label>
          <input 
            type="text" 
            id="modal-transfer-notes" 
            class="form-input" 
            placeholder="e.g. Authorized by John Admin - Order batch OTC-402" 
          />
        </div>
      `,
      confirmText: 'Authorize Stock Transfer',
      onConfirm: (modalEl) => {
        const qtyVal = modalEl.querySelector('#modal-transfer-qty').value;
        const reason = modalEl.querySelector('#modal-transfer-reason').value;
        const notes = modalEl.querySelector('#modal-transfer-notes').value;
        const finalNotes = notes ? `${reason} (${notes})` : reason;

        const res = store.transferBulkToRetail(prod.id, qtyVal, finalNotes);
        if (res.success) {
          showToast(
            'Transfer Complete & Audited',
            `Reallocated ${qtyVal} units of ${prod.name} to Retail Pool. Logged as ${res.transfer.id}.`,
            'success'
          );
          // Re-render
          product = store.getState().products.find((p) => p.id === activeProdId) || store.getState().products[0];
          renderContent();
        } else {
          showToast('Transfer Failed', res.message, 'error');
          return false;
        }
      }
    });
  }

  function renderContent() {
    const currentState = store.getState();
    const currentProducts = currentState.products;
    product = currentProducts.find((p) => p.id === activeProdId) || currentProducts[0];
    const auditLogs = currentState.transferAuditLog || [];

    container.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Inventory Segregation Architecture</h1>
          <p>Dual-pool stock isolation preventing retail sales from consuming reserved clinic supply stock with automated transfer audit trails.</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-secondary" id="btn-back-to-stock">
            ← Stock Overview
          </button>
          <button class="btn btn-primary" id="btn-open-transfer-tool">
            ${Icons.refresh} Transfer Bulk to Retail Pool
          </button>
          <button class="btn btn-secondary" id="btn-next-screen7">
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
              Bulk stock reserved for contracted clinics. Retail point-of-sale transactions cannot deduct from the bulk reserve pool without authorized transfer.
            </div>
          </div>
        </div>

        <!-- Product Selector Dropdown -->
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span style="font-size: 0.8125rem; color: var(--text-muted); font-weight: 600;">Product:</span>
          <select id="seg-product-select" class="form-select" style="min-width: 260px; font-weight: 600;">
            ${currentProducts
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

      <!-- Pool Mode Toggle Switch (Dual Pool / Retail / Bulk) -->
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
          <div class="card segregation-pool-card" style="border-top: 4px solid var(--color-retail);">
            <div class="card-header">
              <div>
                <span class="badge badge-retail" style="margin-bottom: 0.35rem;">Retail Stream</span>
                <div class="card-title" style="color: var(--color-retail);">Retail Store Inventory Pool</div>
                <div class="card-subtitle">Available for walk-in and online single-unit sales</div>
              </div>
              <div class="kpi-icon" style="color: var(--color-retail);">${Icons.user}</div>
            </div>

            <div style="margin: 1.5rem 0; text-align: center;">
              <div style="font-size: 3.25rem; font-weight: 800; color: var(--color-retail); line-height: 1;">
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

            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-secondary btn-sm btn-reorder-retail" style="flex: 1;">
                Restock Retail (+25)
              </button>
              <button class="btn btn-primary btn-sm btn-trigger-transfer" style="flex: 1;">
                ${Icons.refresh} Transfer from Bulk
              </button>
            </div>
          </div>
        `
            : ''
        }

        <!-- Bulk Reserved Pool Column (Locked & Shielded) -->
        ${
          currentViewMode === 'both' || currentViewMode === 'bulk'
            ? `
          <div class="card segregation-pool-card locked" style="border-top: 4px solid var(--color-primary);">
            <div class="card-header">
              <div>
                <span class="badge badge-bulk" style="margin-bottom: 0.35rem;">
                  🔒 Locked & Reserved
                </span>
                <div class="card-title" style="color: var(--color-primary);">B2B Bulk Clinic Inventory Pool</div>
                <div class="card-subtitle">Exclusively reserved for medical practices & clinics</div>
              </div>
              <div class="kpi-icon" style="color: var(--color-primary);">${Icons.shield}</div>
            </div>

            <div style="margin: 1.5rem 0; text-align: center;">
              <div style="font-size: 3.25rem; font-weight: 800; color: var(--color-primary); line-height: 1;">
                ${product.bulkStock}
              </div>
              <div style="font-size: 0.8125rem; color: var(--text-muted); margin-top: 0.35rem;">
                ${product.unit}s reserved for contracted clinic orders
              </div>
            </div>

            <div style="background: var(--bg-card); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.25rem; font-size: 0.8125rem; display: flex; flex-direction: column; gap: 0.5rem; border: 1px solid var(--border-subtle);">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-muted);">B2B Bulk Price (Discounted):</span>
                <strong style="color: var(--color-primary);">R ${product.unitPriceBulk.toFixed(2)}</strong>
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

            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-secondary btn-sm btn-reorder-bulk" style="flex: 1;">
                Restock Bulk (+50)
              </button>
              <button class="btn btn-primary btn-sm btn-open-bulk-order" style="flex: 1;">
                ${Icons.plus} Place Bulk Order
              </button>
            </div>
          </div>
        `
            : ''
        }
      </div>

      <!-- Bulk-to-Retail Transfer Audit Trail Table -->
      <div class="card" style="margin-top: 1.5rem; padding: 0;">
        <div style="padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
          <div>
            <div class="card-title">Bulk-to-Retail Stock Transfer Audit Trail</div>
            <div class="card-subtitle">SARS and operational compliance records for stock pool conversions</div>
          </div>
          <span class="badge badge-info">${auditLogs.length} Reallocations Logged</span>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Transfer Ref</th>
                <th>Timestamp</th>
                <th>Product Description</th>
                <th>Units Moved</th>
                <th>Origin → Destination</th>
                <th>Authorized Operator</th>
                <th>Audit Notes</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${
                auditLogs.length === 0
                  ? `<tr><td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-muted);">No stock transfers logged yet. Use the transfer tool above.</td></tr>`
                  : auditLogs
                      .map(
                        (log) => `
                <tr>
                  <td><span class="code-tag">${log.id}</span></td>
                  <td style="font-family: var(--font-mono); font-size: 0.8125rem; color: var(--text-secondary);">${log.date}</td>
                  <td><strong style="color: var(--text-primary);">${log.productName}</strong></td>
                  <td><strong style="color: var(--color-retail); font-size: 0.95rem;">${log.quantity} units</strong></td>
                  <td>
                    <span style="font-size: 0.8125rem; color: var(--text-secondary);">
                      ${log.from} → <strong style="color: var(--color-retail);">${log.to}</strong>
                    </span>
                  </td>
                  <td><span style="color: var(--text-primary); font-weight: 600;">${log.operator}</span></td>
                  <td><span style="font-size: 0.8125rem; color: var(--text-muted);">${log.notes}</span></td>
                  <td><span class="badge badge-success">✓ ${log.status}</span></td>
                </tr>
              `
                      )
                      .join('')
              }
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Listeners
    container.querySelector('#seg-product-select')?.addEventListener('change', (e) => {
      activeProdId = e.target.value;
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
      showToast('Retail Stock Restocked', `Added 25 units to ${product.name} (Retail Pool).`, 'success');
      renderContent();
    });

    container.querySelector('.btn-reorder-bulk')?.addEventListener('click', () => {
      store.reorderProduct(product.id, 'bulk', 50);
      showToast('Bulk Reserve Restocked', `Added 50 units to ${product.name} (Bulk Reserve Pool).`, 'success');
      renderContent();
    });

    container.querySelectorAll('.btn-trigger-transfer, #btn-open-transfer-tool').forEach((btn) => {
      btn.addEventListener('click', () => {
        openTransferModal(product);
      });
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
