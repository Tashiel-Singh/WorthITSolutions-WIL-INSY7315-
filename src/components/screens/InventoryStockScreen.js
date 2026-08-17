/**
 * Screen 5: Inventory Management - Stock Overview
 * Caption: Figure 5: Inventory Overview - Real-time stock tracking with bulk/retail segregation.
 */
import { store } from '../../store/state.js';
import { Icons } from '../common/Icons.js';
import { openModal } from '../common/Modal.js';
import { showToast } from '../common/Toast.js';

export function renderInventoryStockScreen() {
  const state = store.getState();
  let products = [...state.products];

  let selectedStockFilter = 'all'; // 'all' | 'retail' | 'bulk'
  let selectedCategory = 'all';
  let searchTerm = '';

  const container = document.createElement('div');
  container.className = 'page-content';

  function renderContent() {
    const lowStockItems = products.filter(
      (p) => p.status === 'Low Stock' || p.status === 'Out of Stock'
    );

    let filtered = products.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch =
        !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchStock = true;
      if (selectedStockFilter === 'retail') matchStock = p.retailStock > 0;
      if (selectedStockFilter === 'bulk') matchStock = p.bulkStock > 0;

      return matchCat && matchSearch && matchStock;
    });

    container.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Stock Overview & Inventory Tracking</h1>
          <p>Real-time physical stock counts segregated into Retail and Bulk pools with automated reorder triggers.</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-secondary" id="btn-back-dashboard">
            ← Dashboard
          </button>
          <button class="btn btn-primary" id="btn-next-screen6">
            Next: Segregation Detail →
          </button>
        </div>
      </div>

      <!-- Low Stock Alert Banner -->
      ${
        lowStockItems.length > 0
          ? `
        <div style="padding: 1.15rem 1.5rem; background: var(--status-warning-bg); border: 1px solid var(--status-warning-border); border-radius: var(--radius-lg); margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: gap; gap: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.85rem;">
            <div style="color: var(--status-warning); font-size: 1.25rem;">${Icons.alertTriangle}</div>
            <div>
              <strong style="color: var(--text-primary); font-size: 0.95rem;">
                ${lowStockItems.length} products are running low on stock.
              </strong>
              <div style="font-size: 0.8125rem; color: var(--text-secondary);">
                ${lowStockItems.map((i) => i.name).join(', ')} require restocking to prevent stockouts.
              </div>
            </div>
          </div>
          <button class="btn btn-sm btn-primary" id="btn-reorder-all-low">
            Reorder Low Stock Now
          </button>
        </div>
      `
          : ''
      }

      <!-- Filters & Search Bar Card -->
      <div class="card" style="margin-bottom: 1.5rem; padding: 1.25rem;">
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
          <!-- Search input -->
          <div class="search-input-wrapper" style="flex: 1; min-width: 260px;">
            <span class="search-icon-inside">${Icons.search}</span>
            <input 
              type="text" 
              id="stock-search-input" 
              class="form-input search-input" 
              placeholder="Search product name or SKU (e.g. Arnica, FUR-TBL)..." 
              value="${searchTerm}"
            />
          </div>

          <!-- Stock Pool Filter -->
          <div style="min-width: 160px;">
            <select id="stock-pool-filter" class="form-select">
              <option value="all" ${selectedStockFilter === 'all' ? 'selected' : ''}>All Stock Pools</option>
              <option value="retail" ${selectedStockFilter === 'retail' ? 'selected' : ''}>Retail Stock Only</option>
              <option value="bulk" ${selectedStockFilter === 'bulk' ? 'selected' : ''}>Bulk Reserved Stock Only</option>
            </select>
          </div>

          <!-- Category filter -->
          <div style="min-width: 170px;">
            <select id="stock-cat-filter" class="form-select">
              <option value="all" ${selectedCategory === 'all' ? 'selected' : ''}>All Categories</option>
              <option value="Homeopathic" ${selectedCategory === 'Homeopathic' ? 'selected' : ''}>Homeopathic Remedies</option>
              <option value="Furniture" ${selectedCategory === 'Furniture' ? 'selected' : ''}>Clinic Furniture</option>
            </select>
          </div>

          <div style="font-size: 0.8125rem; color: var(--text-muted);">
            Showing <strong>${filtered.length}</strong> items
          </div>
        </div>
      </div>

      <!-- Inventory Table -->
      <div class="card" style="padding: 0;">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Product Name & SKU</th>
                <th>Category</th>
                <th>Retail Stock Level</th>
                <th>Bulk Stock Level (Reserved)</th>
                <th>Reorder Threshold</th>
                <th>Status</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${
                filtered.length === 0
                  ? `<tr><td colspan="7" style="text-align: center; padding: 3rem; color: var(--text-muted);">No products match the selected criteria.</td></tr>`
                  : filtered
                      .map(
                        (p) => `
                <tr>
                  <td>
                    <div style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem;">${p.name}</div>
                    <span class="code-tag">${p.sku}</span>
                  </td>
                  <td>
                    <span class="badge ${p.category === 'Homeopathic' ? 'badge-info' : 'badge-neutral'}">
                      ${p.category}
                    </span>
                  </td>
                  <td>
                    <strong style="color: #2563eb; font-size: 1.05rem;">${p.retailStock}</strong>
                    <span style="font-size: 0.72rem; color: var(--text-muted);">${p.unit}</span>
                  </td>
                  <td>
                    <strong style="color: #10b981; font-size: 1.05rem;">${p.bulkStock}</strong>
                    <span style="font-size: 0.72rem; color: var(--text-muted);">${p.unit}</span>
                  </td>
                  <td>
                    <span style="color: var(--text-secondary);">${p.reorderLevel} units</span>
                  </td>
                  <td>
                    <span class="badge ${
                      p.status === 'In Stock'
                        ? 'badge-success'
                        : p.status === 'Low Stock'
                        ? 'badge-warning'
                        : 'badge-danger'
                    }">
                      <span class="badge-dot"></span>
                      ${p.status}
                    </span>
                  </td>
                  <td style="text-align: right;">
                    <div style="display: inline-flex; gap: 0.4rem;">
                      <button class="btn btn-sm btn-secondary btn-view-seg" data-id="${p.id}" title="View Segregated Pools">
                        Segregate Pool
                      </button>
                      <button class="btn btn-sm btn-primary btn-reorder-item" data-id="${p.id}" data-name="${p.name}">
                        Reorder
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

    // Listeners
    container.querySelector('#stock-search-input')?.addEventListener('input', (e) => {
      searchTerm = e.target.value;
      renderContent();
    });

    container.querySelector('#stock-pool-filter')?.addEventListener('change', (e) => {
      selectedStockFilter = e.target.value;
      renderContent();
    });

    container.querySelector('#stock-cat-filter')?.addEventListener('change', (e) => {
      selectedCategory = e.target.value;
      renderContent();
    });

    // View segregation detail button
    container.querySelectorAll('.btn-view-seg').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pId = btn.getAttribute('data-id');
        store.navigateTo('bulk-segregation', { productId: pId });
      });
    });

    // Reorder item modal
    container.querySelectorAll('.btn-reorder-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pId = btn.getAttribute('data-id');
        const pName = btn.getAttribute('data-name');

        openModal({
          title: `Reorder Stock: ${pName}`,
          contentHtml: `
            <div class="form-group">
              <label class="form-label">Target Inventory Pool</label>
              <select id="reorder-pool-select" class="form-select">
                <option value="retail">Retail Stock Pool</option>
                <option value="bulk" selected>Bulk Reserved Stock Pool</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Quantity to Procure</label>
              <input type="number" id="reorder-qty-input" class="form-input" value="50" min="1" required />
            </div>
          `,
          confirmText: 'Confirm Restock',
          onConfirm: (modalEl) => {
            const pool = modalEl.querySelector('#reorder-pool-select').value;
            const qty = parseInt(modalEl.querySelector('#reorder-qty-input').value, 10) || 50;
            store.reorderProduct(pId, pool, qty);
            showToast('Stock Reordered', `Added ${qty} units to ${pName} (${pool.toUpperCase()} Pool).`, 'success');
          }
        });
      });
    });

    // Reorder all low stock
    container.querySelector('#btn-reorder-all-low')?.addEventListener('click', () => {
      lowStockItems.forEach((item) => {
        store.reorderProduct(item.id, 'bulk', 60);
      });
      showToast('All Restocked', `Replenished stock for all ${lowStockItems.length} low inventory items.`, 'success');
    });

    container.querySelector('#btn-back-dashboard')?.addEventListener('click', () => {
      store.navigateTo('dashboard');
    });

    container.querySelector('#btn-next-screen6')?.addEventListener('click', () => {
      store.navigateTo('bulk-segregation');
    });
  }

  renderContent();
  return container;
}
