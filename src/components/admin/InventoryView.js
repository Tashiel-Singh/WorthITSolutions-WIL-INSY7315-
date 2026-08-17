/**
 * Full Inventory Control & Supplies Management View (Admin)
 */
import { store } from '../../store/state.js';
import { Icons } from '../common/Icons.js';
import { openModal } from '../common/Modal.js';
import { showToast } from '../common/Toast.js';

export function renderInventoryView() {
  const state = store.getState();
  let inventory = [...state.inventory];

  let selectedCategory = 'all';
  let selectedStatus = 'all';
  let searchTerm = '';

  const container = document.createElement('div');
  container.className = 'page-content';

  function renderContent() {
    // Filter inventory based on filters and search
    let filtered = inventory.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;
      const matchSearch =
        !searchTerm ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchStatus && matchSearch;
    });

    const totalUnits = filtered.reduce((acc, curr) => acc + curr.stockQuantity, 0);

    container.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Central Medical Inventory & Supplies</h1>
          <p>Real-time pharmaceutical dispensing catalog, surgical gear stock, and location tracking.</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" id="btn-add-inventory">
            ${Icons.plus} Add Stock Item
          </button>
        </div>
      </div>

      <!-- Filters & Search Bar Card -->
      <div class="card" style="margin-bottom: 1.5rem; padding: 1.25rem;">
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
          <!-- Search input -->
          <div class="search-input-wrapper" style="flex: 1; min-width: 260px;">
            <span class="search-icon-inside">${Icons.search}</span>
            <input 
              type="text" 
              id="inv-search-input" 
              class="form-input search-input" 
              placeholder="Search by drug name, SKU code, or warehouse bay..." 
              value="${searchTerm}"
            />
          </div>

          <!-- Category filter -->
          <div style="min-width: 180px;">
            <select id="inv-category-filter" class="form-select">
              <option value="all" ${selectedCategory === 'all' ? 'selected' : ''}>All Categories</option>
              <option value="Pharmaceuticals" ${selectedCategory === 'Pharmaceuticals' ? 'selected' : ''}>Pharmaceuticals</option>
              <option value="PPE & Supplies" ${selectedCategory === 'PPE & Supplies' ? 'selected' : ''}>PPE & Supplies</option>
              <option value="Clinical Supplies" ${selectedCategory === 'Clinical Supplies' ? 'selected' : ''}>Clinical Supplies</option>
              <option value="Diagnostic Equipment" ${selectedCategory === 'Diagnostic Equipment' ? 'selected' : ''}>Diagnostic Equipment</option>
            </select>
          </div>

          <!-- Status filter -->
          <div style="min-width: 160px;">
            <select id="inv-status-filter" class="form-select">
              <option value="all" ${selectedStatus === 'all' ? 'selected' : ''}>All Stock Statuses</option>
              <option value="In Stock" ${selectedStatus === 'In Stock' ? 'selected' : ''}>In Stock</option>
              <option value="Low Stock" ${selectedStatus === 'Low Stock' ? 'selected' : ''}>Low Stock</option>
              <option value="Out of Stock" ${selectedStatus === 'Out of Stock' ? 'selected' : ''}>Out of Stock</option>
            </select>
          </div>

          <div style="font-size: 0.8125rem; color: var(--text-muted); padding-left: 0.5rem;">
            Showing <strong>${filtered.length}</strong> items (${totalUnits.toLocaleString()} units)
          </div>
        </div>
      </div>

      <!-- Inventory Table Card -->
      <div class="card" style="padding: 0;">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Item & SKU</th>
                <th>Category</th>
                <th>Available Qty</th>
                <th>Reorder Threshold</th>
                <th>Unit Price</th>
                <th>Location / Bay</th>
                <th>Batch / Expiry</th>
                <th>Status</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${
                filtered.length === 0
                  ? `<tr><td colspan="9" style="text-align: center; padding: 3rem; color: var(--text-muted);">No inventory items match the current search or filters.</td></tr>`
                  : filtered
                      .map(
                        (item) => `
                <tr>
                  <td>
                    <div style="font-weight: 700; color: #fff; font-size: 0.92rem;">${item.name}</div>
                    <span class="code-tag">${item.sku}</span>
                  </td>
                  <td>
                    <span class="badge badge-neutral">${item.category}</span>
                  </td>
                  <td>
                    <strong style="font-size: 1.05rem; color: ${
                      item.stockQuantity === 0
                        ? '#ef4444'
                        : item.stockQuantity <= item.reorderLevel
                        ? '#f59e0b'
                        : '#10b981'
                    };">
                      ${item.stockQuantity}
                    </strong>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">${item.unit}</div>
                  </td>
                  <td>
                    <span style="color: var(--text-secondary);">${item.reorderLevel} units</span>
                  </td>
                  <td>
                    <strong>$${item.unitPrice.toFixed(2)}</strong>
                  </td>
                  <td>
                    <span style="color: var(--text-secondary); font-size: 0.8125rem;">${item.location}</span>
                  </td>
                  <td>
                    <div style="font-size: 0.78125rem; font-family: var(--font-mono); color: var(--text-secondary);">${item.batchNo}</div>
                    <div style="font-size: 0.7rem; color: var(--text-muted);">Exp: ${item.expiryDate}</div>
                  </td>
                  <td>
                    <span class="badge ${
                      item.status === 'In Stock'
                        ? 'badge-success'
                        : item.status === 'Low Stock'
                        ? 'badge-warning'
                        : 'badge-danger'
                    }">
                      <span class="badge-dot"></span>
                      ${item.status}
                    </span>
                  </td>
                  <td style="text-align: right;">
                    <div style="display: inline-flex; gap: 0.4rem;">
                      <button class="btn btn-sm btn-primary btn-item-restock" data-id="${item.id}" data-name="${item.name}" data-stock="${item.stockQuantity}">
                        Restock
                      </button>
                      <button class="btn btn-sm btn-secondary btn-item-edit" data-id="${item.id}" title="Edit Item Details">
                        ${Icons.edit}
                      </button>
                      <button class="btn btn-sm btn-danger btn-item-delete" data-id="${item.id}" data-name="${item.name}" title="Delete Item">
                        ${Icons.trash}
                      </button>
                    </div>
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
    `;

    // Attach listeners
    const searchInput = container.querySelector('#inv-search-input');
    searchInput?.addEventListener('input', (e) => {
      searchTerm = e.target.value;
      renderContent();
    });

    const catSelect = container.querySelector('#inv-category-filter');
    catSelect?.addEventListener('change', (e) => {
      selectedCategory = e.target.value;
      renderContent();
    });

    const statSelect = container.querySelector('#inv-status-filter');
    statSelect?.addEventListener('change', (e) => {
      selectedStatus = e.target.value;
      renderContent();
    });

    // Add Item
    container.querySelector('#btn-add-inventory')?.addEventListener('click', () => {
      openModal({
        title: 'Add New Item to Inventory',
        contentHtml: `
          <div class="form-group">
            <label class="form-label">Item / Drug Name</label>
            <input type="text" id="modal-name" class="form-input" placeholder="e.g. Paracetamol 500mg" required />
          </div>
          <div class="grid-cols-2" style="margin-bottom: 0;">
            <div class="form-group">
              <label class="form-label">Category</label>
              <select id="modal-category" class="form-select">
                <option value="Pharmaceuticals">Pharmaceuticals</option>
                <option value="PPE & Supplies">PPE & Supplies</option>
                <option value="Clinical Supplies">Clinical Supplies</option>
                <option value="Diagnostic Equipment">Diagnostic Equipment</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">SKU Code</label>
              <input type="text" id="modal-sku" class="form-input" placeholder="e.g. MED-PAR-500" />
            </div>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 0;">
            <div class="form-group">
              <label class="form-label">Initial Stock Count</label>
              <input type="number" id="modal-qty" class="form-input" value="120" min="0" />
            </div>
            <div class="form-group">
              <label class="form-label">Reorder Level Threshold</label>
              <input type="number" id="modal-reorder" class="form-input" value="30" min="1" />
            </div>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 0;">
            <div class="form-group">
              <label class="form-label">Unit Price ($)</label>
              <input type="number" id="modal-price" class="form-input" value="12.50" step="0.25" />
            </div>
            <div class="form-group">
              <label class="form-label">Packaging Unit</label>
              <input type="text" id="modal-unit" class="form-input" value="Bottle (60 tabs)" />
            </div>
          </div>
          <div class="grid-cols-2" style="margin-bottom: 0;">
            <div class="form-group">
              <label class="form-label">Storage Location / Bay</label>
              <input type="text" id="modal-loc" class="form-input" value="Pharmacy Bay A-5" />
            </div>
            <div class="form-group">
              <label class="form-label">Batch No.</label>
              <input type="text" id="modal-batch" class="form-input" value="BAT-2026-90Z" />
            </div>
          </div>
        `,
        confirmText: 'Save to Catalog',
        onConfirm: (modalEl) => {
          const name = modalEl.querySelector('#modal-name').value.trim();
          if (!name) {
            showToast('Validation Error', 'Item name is required.', 'error');
            return false;
          }
          const category = modalEl.querySelector('#modal-category').value;
          const sku = modalEl.querySelector('#modal-sku').value.trim() || `SKU-${Date.now().toString().slice(-4)}`;
          const stockQuantity = modalEl.querySelector('#modal-qty').value;
          const reorderLevel = modalEl.querySelector('#modal-reorder').value;
          const unitPrice = modalEl.querySelector('#modal-price').value;
          const unit = modalEl.querySelector('#modal-unit').value;
          const location = modalEl.querySelector('#modal-loc').value;
          const batchNo = modalEl.querySelector('#modal-batch').value;

          store.addInventoryItem({ name, category, sku, stockQuantity, reorderLevel, unitPrice, unit, location, batchNo });
          showToast('Item Added', `${name} successfully added to inventory.`, 'success');
        }
      });
    });

    // Restock buttons
    container.querySelectorAll('.btn-item-restock').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const curStock = parseInt(btn.getAttribute('data-stock'), 10);

        openModal({
          title: `Restock Item: ${name}`,
          contentHtml: `
            <div class="form-group">
              <label class="form-label">Current Stock on Hand</label>
              <input type="number" class="form-input" value="${curStock}" disabled />
            </div>
            <div class="form-group">
              <label class="form-label">Units to Add</label>
              <input type="number" id="input-restock-add" class="form-input" value="60" min="1" required />
            </div>
            <div class="form-group">
              <label class="form-label">Restock Reason / PO Reference</label>
              <input type="text" id="input-restock-reason" class="form-input" value="Shipment Intake PO-8812" />
            </div>
          `,
          confirmText: 'Confirm Restock',
          onConfirm: (modalEl) => {
            const addQty = parseInt(modalEl.querySelector('#input-restock-add').value, 10);
            const reason = modalEl.querySelector('#input-restock-reason').value;
            if (isNaN(addQty) || addQty <= 0) {
              showToast('Invalid Amount', 'Please provide a valid positive quantity.', 'error');
              return false;
            }
            store.updateInventoryStock(id, curStock + addQty, reason);
            showToast('Stock Updated', `Restocked ${name} with ${addQty} additional units.`, 'success');
          }
        });
      });
    });

    // Edit Item Button
    container.querySelectorAll('.btn-item-edit').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = store.getState().inventory.find((i) => i.id === id);
        if (!item) return;

        openModal({
          title: `Edit Inventory Item: ${item.name}`,
          contentHtml: `
            <div class="form-group">
              <label class="form-label">Item Name</label>
              <input type="text" id="edit-name" class="form-input" value="${item.name}" required />
            </div>
            <div class="grid-cols-2" style="margin-bottom: 0;">
              <div class="form-group">
                <label class="form-label">Current Stock Count</label>
                <input type="number" id="edit-qty" class="form-input" value="${item.stockQuantity}" min="0" />
              </div>
              <div class="form-group">
                <label class="form-label">Reorder Level</label>
                <input type="number" id="edit-reorder" class="form-input" value="${item.reorderLevel}" min="1" />
              </div>
            </div>
            <div class="grid-cols-2" style="margin-bottom: 0;">
              <div class="form-group">
                <label class="form-label">Unit Price ($)</label>
                <input type="number" id="edit-price" class="form-input" value="${item.unitPrice}" step="0.25" />
              </div>
              <div class="form-group">
                <label class="form-label">Location / Storage Bay</label>
                <input type="text" id="edit-loc" class="form-input" value="${item.location}" />
              </div>
            </div>
          `,
          confirmText: 'Update Details',
          onConfirm: (modalEl) => {
            item.name = modalEl.querySelector('#edit-name').value.trim();
            item.stockQuantity = parseInt(modalEl.querySelector('#edit-qty').value, 10) || 0;
            item.reorderLevel = parseInt(modalEl.querySelector('#edit-reorder').value, 10) || 20;
            item.unitPrice = parseFloat(modalEl.querySelector('#edit-price').value) || 0;
            item.location = modalEl.querySelector('#edit-loc').value.trim();
            item.status = store.calculateStockStatus(item.stockQuantity, item.reorderLevel);

            store.logAudit('Inventory Item Modified', `Updated specifications for ${item.name} (${item.sku}).`, 'inventory');
            store.notify();
            showToast('Item Updated', `Updated details for ${item.name}.`, 'success');
          }
        });
      });
    });

    // Delete Item
    container.querySelectorAll('.btn-item-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        openModal({
          title: `Delete Inventory Item?`,
          contentHtml: `
            <p style="color: var(--text-secondary);">
              Are you sure you want to permanently remove <strong>${name}</strong> from the hospital inventory database?
            </p>
          `,
          confirmText: 'Yes, Delete Item',
          onConfirm: () => {
            store.deleteInventoryItem(id);
            showToast('Item Deleted', `Removed ${name} from catalog.`, 'info');
          }
        });
      });
    });
  }

  renderContent();
  return container;
}
