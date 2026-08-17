/**
 * Screen 9: Operational Workflow - Order Management
 * Caption: Figure 9: Order Management - Centralized view of all bulk and retail orders.
 */
import { store } from '../../store/state.js';
import { Icons } from '../common/Icons.js';
import { openModal } from '../common/Modal.js';
import { showToast } from '../common/Toast.js';

export function renderOrderManagementScreen() {
  const state = store.getState();
  let orders = [...state.orders];

  let selectedStatus = 'all';
  let searchTerm = '';

  const container = document.createElement('div');
  container.className = 'page-content';

  function renderContent() {
    let filtered = orders.filter((o) => {
      const matchStatus = selectedStatus === 'all' || o.status === selectedStatus;
      const matchSearch =
        !searchTerm ||
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.clientName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchStatus && matchSearch;
    });

    container.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Centralized Order Management</h1>
          <p>Real-time fulfillment tracking, dispatch status, and order lifecycle management.</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" id="btn-create-order-s7">
            ${Icons.plus} New Bulk Order
          </button>
          <button class="btn btn-secondary" id="btn-next-screen10">
            Next: Payment Reminders →
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
              id="order-search-input" 
              class="form-input search-input" 
              placeholder="Search by order # (e.g. ORD-8041) or client clinic..." 
              value="${searchTerm}"
            />
          </div>

          <!-- Status filter -->
          <div style="min-width: 170px;">
            <select id="order-status-filter" class="form-select">
              <option value="all" ${selectedStatus === 'all' ? 'selected' : ''}>All Order Statuses</option>
              <option value="Pending" ${selectedStatus === 'Pending' ? 'selected' : ''}>Pending (Awaiting Prep)</option>
              <option value="Processing" ${selectedStatus === 'Processing' ? 'selected' : ''}>Processing (Warehouse)</option>
              <option value="Shipped" ${selectedStatus === 'Shipped' ? 'selected' : ''}>Shipped (In Transit)</option>
              <option value="Delivered" ${selectedStatus === 'Delivered' ? 'selected' : ''}>Delivered (Closed)</option>
            </select>
          </div>

          <div style="font-size: 0.8125rem; color: var(--text-muted);">
            Showing <strong>${filtered.length}</strong> of ${orders.length} orders
          </div>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="card" style="padding: 0;">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Client Name & Channel</th>
                <th>Order Date</th>
                <th>Line Items Count</th>
                <th>Total Value (Incl. VAT)</th>
                <th>Status</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${
                filtered.length === 0
                  ? `<tr><td colspan="7" style="text-align: center; padding: 3rem; color: var(--text-muted);">No orders match the selected filter.</td></tr>`
                  : filtered
                      .map(
                        (ord) => `
                <tr>
                  <td>
                    <strong style="color: var(--text-primary); font-family: var(--font-mono); font-size: 0.95rem;">${ord.id}</strong>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">${ord.type}</div>
                  </td>
                  <td>
                    <div style="font-weight: 700; color: var(--text-primary); font-size: 0.92rem;">${ord.clientName}</div>
                    <span class="code-tag">${ord.clientId}</span>
                  </td>
                  <td>
                    <span style="color: var(--text-secondary); font-size: 0.8125rem;">${ord.orderDate}</span>
                  </td>
                  <td>
                    <span style="font-weight: 600; color: var(--text-primary);">${ord.items?.length || 2} Products</span>
                  </td>
                  <td>
                    <strong style="color: var(--color-primary); font-size: 1rem;">
                      R ${ord.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </strong>
                  </td>
                  <td>
                    <span class="badge ${
                      ord.status === 'Delivered'
                        ? 'badge-success'
                        : ord.status === 'Shipped'
                        ? 'badge-info'
                        : ord.status === 'Processing'
                        ? 'badge-retail'
                        : 'badge-warning'
                    }">
                      <span class="badge-dot"></span>
                      ${ord.status}
                    </span>
                  </td>
                  <td style="text-align: right;">
                    <div style="display: inline-flex; gap: 0.4rem;">
                      <button class="btn btn-sm btn-secondary btn-view-order" data-id="${ord.id}" title="Inspect Order Details">
                        View
                      </button>
                      ${
                        ord.status !== 'Delivered' && ord.status !== 'Shipped'
                          ? `
                        <button class="btn btn-sm btn-primary btn-ship-order" data-id="${ord.id}">
                          Mark Shipped
                        </button>
                      `
                          : ''
                      }
                      <button class="btn btn-sm btn-secondary btn-goto-inv" data-id="${ord.id}" title="View Invoice">
                        Invoice →
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
    container.querySelector('#order-search-input')?.addEventListener('input', (e) => {
      searchTerm = e.target.value;
      renderContent();
    });

    container.querySelector('#order-status-filter')?.addEventListener('change', (e) => {
      selectedStatus = e.target.value;
      renderContent();
    });

    // Mark as shipped
    container.querySelectorAll('.btn-ship-order').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        store.updateOrderStatus(id, 'Shipped');
        showToast('Status Updated', `Order ${id} marked as Shipped. Waybill generated.`, 'success');
      });
    });

    // View Order Details Modal
    container.querySelectorAll('.btn-view-order').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const order = store.getState().orders.find((o) => o.id === id);
        if (!order) return;

        openModal({
          title: `Order Details: ${order.id}`,
          contentHtml: `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.75rem;">
                <div>
                  <div style="font-weight: 700; font-size: 1.05rem; color: var(--text-primary);">${order.clientName}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Ordered on: ${order.orderDate}</div>
                </div>
                <span class="badge badge-info">${order.status}</span>
              </div>

              <div>
                <div style="font-weight: 700; font-size: 0.8125rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Ordered Products:</div>
                <div style="display: flex; flex-direction: column; gap: 0.4rem;">
                  ${order.items
                    .map(
                      (it) => `
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem 0.75rem; background: var(--bg-surface-subtle); border-radius: var(--radius-sm); font-size: 0.8125rem;">
                      <span>${it.productName || it.description} (x${it.quantity || it.qty})</span>
                      <strong>R ${(it.lineTotal || it.unitPrice * (it.quantity || 1)).toFixed(2)}</strong>
                    </div>
                  `
                    )
                    .join('')}
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; padding-top: 0.5rem; border-top: 1px solid var(--border-subtle); font-weight: 800; font-size: 1rem; color: var(--text-primary);">
                <span>Total Value (Incl. VAT):</span>
                <span style="color: var(--color-primary);">R ${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          `,
          cancelText: 'Close'
        });
      });
    });

    // Jump to invoice
    container.querySelectorAll('.btn-goto-inv').forEach((btn) => {
      btn.addEventListener('click', () => {
        store.navigateTo('invoicing');
      });
    });

    container.querySelector('#btn-create-order-s7')?.addEventListener('click', () => {
      store.navigateTo('bulk-order');
    });

    container.querySelector('#btn-next-screen10')?.addEventListener('click', () => {
      store.navigateTo('payment-reminders');
    });
  }

  renderContent();
  return container;
}
