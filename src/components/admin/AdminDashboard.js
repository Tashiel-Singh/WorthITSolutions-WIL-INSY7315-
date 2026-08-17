/**
 * Admin Overview & KPI Dashboard
 */
import { store } from '../../store/state.js';
import { Icons } from '../common/Icons.js';
import { openModal } from '../common/Modal.js';
import { showToast } from '../common/Toast.js';

export function renderAdminDashboard() {
  const state = store.getState();
  const inventory = state.inventory;
  const patients = state.patients;
  const users = state.users;
  const logs = state.auditLogs;

  // Compute metrics
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter((i) => i.status === 'Low Stock' || i.status === 'Out of Stock');
  const totalValue = inventory.reduce((acc, curr) => acc + curr.stockQuantity * curr.unitPrice, 0);
  const activeDoctorsCount = users.filter((u) => u.role === 'doctor' && u.status === 'active').length;

  const container = document.createElement('div');
  container.className = 'page-content';

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1>Administrative & Inventory Command</h1>
        <p>Real-time hospital inventory valuation, clinician staffing, and system compliance metrics.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" id="btn-quick-add-item">
          ${Icons.plus} Add Stock Item
        </button>
        <button class="btn btn-secondary" id="btn-quick-add-user">
          ${Icons.users} New Staff User
        </button>
      </div>
    </div>

    <!-- KPI Metric Cards -->
    <div class="grid-cols-4">
      <div class="card kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Inventory Valuation</span>
          <div class="kpi-icon">${Icons.inventory}</div>
        </div>
        <div class="kpi-value">$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        <div class="kpi-footer">
          <span class="kpi-trend-up">↑ 4.2%</span>
          <span class="kpi-footer-text">across ${totalItems} SKUs</span>
        </div>
      </div>

      <div class="card kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Stock Critical Alerts</span>
          <div class="kpi-icon" style="color: var(--status-danger);">${Icons.alertTriangle}</div>
        </div>
        <div class="kpi-value" style="color: ${lowStockItems.length > 0 ? '#f87171' : '#10b981'};">
          ${lowStockItems.length}
        </div>
        <div class="kpi-footer">
          <span class="${lowStockItems.length > 0 ? 'kpi-trend-down' : 'kpi-trend-up'}">
            ${lowStockItems.length > 0 ? 'Action Required' : 'All Levels Optimal'}
          </span>
          <span class="kpi-footer-text">below reorder threshold</span>
        </div>
      </div>

      <div class="card kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Active Clinicians</span>
          <div class="kpi-icon" style="color: #2dd4bf;">${Icons.stethoscope}</div>
        </div>
        <div class="kpi-value">${activeDoctorsCount}</div>
        <div class="kpi-footer">
          <span class="kpi-trend-up">100% on duty</span>
          <span class="kpi-footer-text">in Cardiology & GP</span>
        </div>
      </div>

      <div class="card kpi-card">
        <div class="kpi-header">
          <span class="kpi-label">Registered Patients</span>
          <div class="kpi-icon" style="color: #60a5fa;">${Icons.patients}</div>
        </div>
        <div class="kpi-value">${patients.length}</div>
        <div class="kpi-footer">
          <span class="kpi-trend-up">↑ 12%</span>
          <span class="kpi-footer-text">active charts managed</span>
        </div>
      </div>
    </div>

    <!-- Lower Section: Low Stock Warning Feed + Recent System Audit -->
    <div class="grid-cols-2-1">
      <!-- Low Stock Items Urgent Panel -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">
              ${Icons.alertTriangle} Low & Critical Stock Reorder Feed
            </div>
            <div class="card-subtitle">Items requiring immediate procurement or warehouse restock</div>
          </div>
          <button class="btn btn-sm btn-secondary" id="btn-view-all-inventory">
            Manage All (${totalItems})
          </button>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Item / SKU</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Reorder Level</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${
                lowStockItems.length === 0
                  ? `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">All inventory levels are currently above reorder thresholds.</td></tr>`
                  : lowStockItems
                      .map(
                        (item) => `
                <tr>
                  <td>
                    <div style="font-weight: 700; color: #fff;">${item.name}</div>
                    <span class="code-tag">${item.sku}</span>
                  </td>
                  <td><span style="color: var(--text-secondary);">${item.category}</span></td>
                  <td>
                    <strong style="color: ${item.stockQuantity === 0 ? '#ef4444' : '#f59e0b'}; font-size: 1rem;">
                      ${item.stockQuantity}
                    </strong>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">${item.unit}</span>
                  </td>
                  <td>${item.reorderLevel}</td>
                  <td>
                    <span class="badge ${
                      item.status === 'Out of Stock' ? 'badge-danger' : 'badge-warning'
                    }">
                      <span class="badge-dot"></span>
                      ${item.status}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-primary btn-restock-quick" data-id="${item.id}" data-name="${item.name}" data-stock="${item.stockQuantity}">
                      Restock
                    </button>
                  </td>
                </tr>
              `
                      )
                      .join('')
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Recent System Audit & Event Stream -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">${Icons.audit} Recent System Audit</div>
            <div class="card-subtitle">Live activity stream across roles</div>
          </div>
          <button class="btn btn-sm btn-secondary" id="btn-view-audit-logs">
            Full Audit
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.85rem; max-height: 400px; overflow-y: auto; padding-right: 0.35rem;">
          ${logs
            .slice(0, 6)
            .map(
              (log) => `
            <div style="padding: 0.85rem; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.3rem;">
                <span style="font-size: 0.75rem; font-weight: 700; color: var(--role-color);">${log.action}</span>
                <span style="font-size: 0.7rem; color: var(--text-muted);">${log.timestamp}</span>
              </div>
              <div style="font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.4;">${log.detail}</div>
              <div style="margin-top: 0.4rem; font-size: 0.7rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.3rem;">
                ${Icons.user} <span>${log.user}</span>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    </div>
  `;

  // Attach quick restock modal handler
  container.querySelectorAll('.btn-restock-quick').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const curStock = parseInt(btn.getAttribute('data-stock'), 10);

      openModal({
        title: `Restock Inventory: ${name}`,
        contentHtml: `
          <div class="form-group">
            <label class="form-label">Current Stock Quantity</label>
            <input type="number" class="form-input" value="${curStock}" disabled />
          </div>
          <div class="form-group">
            <label class="form-label">Additional Quantity to Add</label>
            <input type="number" id="input-restock-add" class="form-input" value="50" min="1" required />
          </div>
          <div class="form-group">
            <label class="form-label">Restock Batch Reference / Reason</label>
            <input type="text" id="input-restock-reason" class="form-input" value="Supplier Shipment Restock" />
          </div>
        `,
        confirmText: 'Add to Inventory',
        onConfirm: (modalEl) => {
          const addQty = parseInt(modalEl.querySelector('#input-restock-add').value, 10);
          const reason = modalEl.querySelector('#input-restock-reason').value;
          if (isNaN(addQty) || addQty <= 0) {
            showToast('Invalid Quantity', 'Please enter a positive restock number.', 'error');
            return false;
          }
          store.updateInventoryStock(id, curStock + addQty, reason);
          showToast('Inventory Updated', `Added ${addQty} units to ${name}.`, 'success');
        }
      });
    });
  });

  // Navigate to tabs
  container.querySelector('#btn-view-all-inventory')?.addEventListener('click', () => {
    store.setActiveTab('inventory');
  });

  container.querySelector('#btn-view-audit-logs')?.addEventListener('click', () => {
    store.setActiveTab('audit');
  });

  // Quick Add Item Modal
  container.querySelector('#btn-quick-add-item')?.addEventListener('click', () => {
    openModal({
      title: 'Add New Inventory Item',
      contentHtml: `
        <div class="form-group">
          <label class="form-label">Item / Drug Name</label>
          <input type="text" id="add-item-name" class="form-input" placeholder="e.g. Ciprofloxacin 500mg" required />
        </div>
        <div class="grid-cols-2" style="margin-bottom: 0;">
          <div class="form-group">
            <label class="form-label">Category</label>
            <select id="add-item-category" class="form-select">
              <option value="Pharmaceuticals">Pharmaceuticals</option>
              <option value="PPE & Supplies">PPE & Supplies</option>
              <option value="Clinical Supplies">Clinical Supplies</option>
              <option value="Diagnostic Equipment">Diagnostic Equipment</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">SKU Code</label>
            <input type="text" id="add-item-sku" class="form-input" placeholder="e.g. MED-CIP-500" />
          </div>
        </div>
        <div class="grid-cols-2" style="margin-bottom: 0;">
          <div class="form-group">
            <label class="form-label">Initial Stock Qty</label>
            <input type="number" id="add-item-qty" class="form-input" value="100" min="0" />
          </div>
          <div class="form-group">
            <label class="form-label">Reorder Threshold</label>
            <input type="number" id="add-item-reorder" class="form-input" value="30" min="1" />
          </div>
        </div>
        <div class="grid-cols-2" style="margin-bottom: 0;">
          <div class="form-group">
            <label class="form-label">Unit Price ($)</label>
            <input type="number" id="add-item-price" class="form-input" value="15.00" step="0.25" />
          </div>
          <div class="form-group">
            <label class="form-label">Packaging Unit</label>
            <input type="text" id="add-item-unit" class="form-input" value="Bottle (50 tabs)" />
          </div>
        </div>
      `,
      confirmText: 'Create Item',
      onConfirm: (modalEl) => {
        const name = modalEl.querySelector('#add-item-name').value.trim();
        if (!name) {
          showToast('Validation Error', 'Item name is required.', 'error');
          return false;
        }
        const category = modalEl.querySelector('#add-item-category').value;
        const sku = modalEl.querySelector('#add-item-sku').value.trim() || `SKU-${Date.now().toString().slice(-4)}`;
        const stockQuantity = modalEl.querySelector('#add-item-qty').value;
        const reorderLevel = modalEl.querySelector('#add-item-reorder').value;
        const unitPrice = modalEl.querySelector('#add-item-price').value;
        const unit = modalEl.querySelector('#add-item-unit').value;

        store.addInventoryItem({ name, category, sku, stockQuantity, reorderLevel, unitPrice, unit });
        showToast('Item Created', `${name} successfully added to inventory.`, 'success');
      }
    });
  });

  // Quick Add Staff Modal
  container.querySelector('#btn-quick-add-user')?.addEventListener('click', () => {
    openModal({
      title: 'Register New Staff / User Account',
      contentHtml: `
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input type="text" id="add-user-name" class="form-input" placeholder="e.g. Dr. Alan Grant" required />
        </div>
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input type="email" id="add-user-email" class="form-input" placeholder="alan.grant@hospital.care" required />
        </div>
        <div class="grid-cols-2" style="margin-bottom: 0;">
          <div class="form-group">
            <label class="form-label">User Role</label>
            <select id="add-user-role" class="form-select">
              <option value="doctor">Medical Doctor</option>
              <option value="admin">Administrator</option>
              <option value="client">Client / Patient</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Department / Title</label>
            <input type="text" id="add-user-dept" class="form-input" placeholder="e.g. Pediatrics" />
          </div>
        </div>
      `,
      confirmText: 'Create Account',
      onConfirm: (modalEl) => {
        const name = modalEl.querySelector('#add-user-name').value.trim();
        const email = modalEl.querySelector('#add-user-email').value.trim();
        const role = modalEl.querySelector('#add-user-role').value;
        const department = modalEl.querySelector('#add-user-dept').value.trim();

        if (!name || !email) {
          showToast('Validation Error', 'Name and Email are required fields.', 'error');
          return false;
        }

        const newUser = store.addUser({ name, email, role, department, username: email.split('@')[0] });
        showToast('User Created', `Account created for ${newUser.name} as ${role.toUpperCase()}.`, 'success');
      }
    });
  });

  return container;
}
