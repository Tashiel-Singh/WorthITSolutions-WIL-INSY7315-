/**
 * Screen 2: Main Dashboard (Overview)
 * Caption: Figure 2: Main Dashboard - Real-time visibility into financial, inventory, and operational metrics.
 */
import { store } from '../../store/state.js';
import { Icons } from '../common/Icons.js';

export function renderDashboardScreen() {
  const state = store.getState();
  const user = state.currentUser;
  const products = state.products;
  const invoices = state.invoices;
  const orders = state.orders;
  const revenueData = state.revenueData;

  // Metrics
  const lowStockProducts = products.filter((p) => p.status === 'Low Stock' || p.status === 'Out of Stock');
  const overdueInvoices = invoices.filter((i) => i.status === 'Overdue');
  const pendingOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Processing');
  const totalRetailUnits = products.reduce((acc, curr) => acc + curr.retailStock, 0);
  const totalBulkUnits = products.reduce((acc, curr) => acc + curr.bulkStock, 0);

  const container = document.createElement('div');
  container.className = 'page-content';

  container.innerHTML = `
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-title-group">
        <h1>Welcome back, ${user.name}</h1>
        <p>Operations Overview - ${new Date().toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" id="btn-dash-bulk-order">
          ${Icons.plus} New Bulk Order
        </button>
        <button class="btn btn-secondary" id="btn-dash-tax">
          ${Icons.shield} Tax Deduction Engine
        </button>
      </div>
    </div>

    <!-- 3 Core Integrated Cards (Financial + Inventory + Operational) -->
    <div class="grid-cols-3">
      <!-- 1. Financial Card -->
      <div class="card" style="border-top: 3px solid var(--color-primary);">
        <div class="card-header">
          <div>
            <div class="card-title">${Icons.records} Financial Stream</div>
            <div class="card-subtitle">Revenue segregation & tax optimization</div>
          </div>
          <button class="btn btn-sm btn-secondary" id="btn-open-s4">View Breakdown →</button>
        </div>

        <div style="display: flex; gap: 1.5rem; margin-bottom: 1.25rem;">
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">6-Mo Revenue Growth</div>
            <div style="font-size: 1.6rem; font-weight: 800; color: var(--status-success);">+45%</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">vs. May 2026 Baseline</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Tax Savings Engine</div>
            <div style="font-size: 1.6rem; font-weight: 800; color: var(--color-primary);">22.8%</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">Depreciation & VAT</div>
          </div>
        </div>

        <!-- Retail vs Bulk Split Bar -->
        <div style="margin-bottom: 0.5rem; font-size: 0.8125rem; font-weight: 700; display: flex; justify-content: space-between;">
          <span style="color: var(--color-retail);">Retail: 45%</span>
          <span style="color: var(--color-primary);">Bulk B2B: 55%</span>
        </div>
        <div class="pie-split-bar" style="margin-bottom: 1rem;">
          <div class="pie-seg-retail" style="width: 45%;">45% Retail</div>
          <div class="pie-seg-bulk" style="width: 55%;">55% Bulk</div>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted);">
          <span>Stream Segregation Active</span>
          <a href="#" id="link-goto-tax-engine" style="font-weight: 600;">Calculate Tax Deductions →</a>
        </div>
      </div>

      <!-- 2. Inventory Card -->
      <div class="card" style="border-top: 3px solid var(--color-bulk);">
        <div class="card-header">
          <div>
            <div class="card-title">${Icons.inventory} Inventory Stream</div>
            <div class="card-subtitle">Segregated stock pools & stockout alerts</div>
          </div>
          <button class="btn btn-sm btn-secondary" id="btn-open-s5">Manage Stock →</button>
        </div>

        <div style="display: flex; gap: 1.5rem; margin-bottom: 1.25rem;">
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Low Stock Alerts</div>
            <div style="font-size: 1.6rem; font-weight: 800; color: ${lowStockProducts.length > 0 ? '#f59e0b' : '#10b981'};">
              ${lowStockProducts.length} Items
            </div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">Immediate restock needed</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Stock Turnover</div>
            <div style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary);">4.2x</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">Optimal flow rate</div>
          </div>
        </div>

        <!-- Segregated Stock Level comparison -->
        <div style="background: var(--bg-surface-subtle); border-radius: var(--radius-sm); padding: 0.75rem; margin-bottom: 1rem; display: flex; justify-content: space-between;">
          <div>
            <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Retail Pool</div>
            <strong style="color: var(--color-retail); font-size: 1rem;">${totalRetailUnits} units</strong>
          </div>
          <div style="border-right: 1px solid var(--border-subtle);"></div>
          <div>
            <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Bulk Reserved Pool</div>
            <strong style="color: var(--color-primary); font-size: 1rem;">${totalBulkUnits} units</strong>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted);">
          <span>Cannibalization Prevention: <strong>ON</strong></span>
          <a href="#" id="link-goto-segregation" style="font-weight: 600;">View Pool Segregation →</a>
        </div>
      </div>

      <!-- 3. Operational Card -->
      <div class="card" style="border-top: 3px solid #f59e0b;">
        <div class="card-header">
          <div>
            <div class="card-title">${Icons.appointments} Operational Workflow</div>
            <div class="card-subtitle">Fulfillment queue & receivables</div>
          </div>
          <button class="btn btn-sm btn-secondary" id="btn-open-s9">View Orders →</button>
        </div>

        <div style="display: flex; gap: 1.5rem; margin-bottom: 1.25rem;">
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Pending Orders</div>
            <div style="font-size: 1.6rem; font-weight: 800; color: var(--color-primary);">${pendingOrders.length}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">In fulfillment queue</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Overdue Invoices</div>
            <div style="font-size: 1.6rem; font-weight: 800; color: #ef4444;">${overdueInvoices.length}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">Reminders automated</div>
          </div>
        </div>

        <div style="background: var(--bg-surface-subtle); border-radius: var(--radius-sm); padding: 0.75rem; margin-bottom: 1rem;">
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">Active Action Tasks:</div>
          <div style="font-size: 0.75rem; color: var(--text-secondary);">• Dispatch ORD-8042 to MedCentre Health Group</div>
          <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.15rem;">• Review 14-day reminder for Dr. T. Naidoo</div>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted);">
          <a href="#" id="link-goto-invoicing" style="font-weight: 600;">Invoicing →</a>
          <a href="#" id="link-goto-reminders" style="font-weight: 600; color: #ef4444;">Reminders →</a>
        </div>
      </div>
    </div>

    <!-- Monthly Revenue Growth Bar Chart & System Fast Links -->
    <div class="grid-cols-2-1">
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Monthly Revenue Segregation Growth (May - October 2026)</div>
            <div class="card-subtitle">Retail vs. Bulk revenue trajectory over time</div>
          </div>
          <button class="btn btn-sm btn-secondary" id="btn-view-revenue-detail">Detailed Analysis →</button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem; padding-top: 0.5rem;">
          ${revenueData
            .map(
              (r) => `
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; margin-bottom: 0.35rem;">
                <span style="font-weight: 600; color: var(--text-primary);">${r.month}</span>
                <span style="font-weight: 700; color: var(--status-success);">${r.totalGrowth} (R ${(r.retailRevenue + r.bulkRevenue).toLocaleString()})</span>
              </div>
              <div class="pie-split-bar" style="height: 18px;">
                <div class="pie-seg-retail" style="width: ${r.retailPercent}%; font-size: 0.68rem;">Retail ${r.retailPercent}%</div>
                <div class="pie-seg-bulk" style="width: ${r.bulkPercent}%; font-size: 0.68rem;">Bulk ${r.bulkPercent}%</div>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <!-- Quick Actions Navigator Panel -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Quick Actions & Workflows</div>
            <div class="card-subtitle">Fast access to core operational modules</div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.45rem;">
          <button class="btn btn-secondary btn-sm" id="btn-jump-s3" style="justify-content: flex-start; gap: 0.6rem;">
            ${Icons.shield}
            <span>Tax Deduction Engine</span>
          </button>
          <button class="btn btn-secondary btn-sm" id="btn-jump-s4" style="justify-content: flex-start; gap: 0.6rem;">
            ${Icons.records}
            <span>Revenue Segregation</span>
          </button>
          <button class="btn btn-secondary btn-sm" id="btn-jump-s5" style="justify-content: flex-start; gap: 0.6rem;">
            ${Icons.inventory}
            <span>Inventory Stock Overview</span>
          </button>
          <button class="btn btn-secondary btn-sm" id="btn-jump-s6" style="justify-content: flex-start; gap: 0.6rem;">
            ${Icons.activity}
            <span>Bulk / Retail Segregation Pool</span>
          </button>
          <button class="btn btn-secondary btn-sm" id="btn-jump-s7" style="justify-content: flex-start; gap: 0.6rem;">
            ${Icons.plus}
            <span>Bulk Order Portal</span>
          </button>
          <button class="btn btn-secondary btn-sm" id="btn-jump-s8" style="justify-content: flex-start; gap: 0.6rem;">
            ${Icons.records}
            <span>Automated Invoicing</span>
          </button>
          <button class="btn btn-secondary btn-sm" id="btn-jump-s9" style="justify-content: flex-start; gap: 0.6rem;">
            ${Icons.appointments}
            <span>Order Management</span>
          </button>
          <button class="btn btn-secondary btn-sm" id="btn-jump-s10" style="justify-content: flex-start; gap: 0.6rem;">
            ${Icons.bell}
            <span>Payment Reminders</span>
          </button>
          <button class="btn btn-primary btn-sm" id="btn-jump-s11" style="justify-content: flex-start; gap: 0.6rem;">
            ${Icons.activity}
            <span>Executive Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  `;

  // Attach jump links
  const jumps = [
    { id: '#btn-dash-bulk-order', screen: 'bulk-order' },
    { id: '#btn-dash-tax', screen: 'tax-engine' },
    { id: '#btn-open-s4', screen: 'revenue-segregation' },
    { id: '#btn-open-s5', screen: 'inventory-overview' },
    { id: '#btn-open-s9', screen: 'order-management' },
    { id: '#link-goto-tax-engine', screen: 'tax-engine' },
    { id: '#link-goto-segregation', screen: 'bulk-segregation' },
    { id: '#link-goto-invoicing', screen: 'invoicing' },
    { id: '#link-goto-reminders', screen: 'payment-reminders' },
    { id: '#btn-view-revenue-detail', screen: 'revenue-segregation' },
    { id: '#btn-jump-s3', screen: 'tax-engine' },
    { id: '#btn-jump-s4', screen: 'revenue-segregation' },
    { id: '#btn-jump-s5', screen: 'inventory-overview' },
    { id: '#btn-jump-s6', screen: 'bulk-segregation' },
    { id: '#btn-jump-s7', screen: 'bulk-order' },
    { id: '#btn-jump-s8', screen: 'invoicing' },
    { id: '#btn-jump-s9', screen: 'order-management' },
    { id: '#btn-jump-s10', screen: 'payment-reminders' },
    { id: '#btn-jump-s11', screen: 'executive-dashboard' }
  ];

  jumps.forEach((j) => {
    container.querySelector(j.id)?.addEventListener('click', (e) => {
      e.preventDefault();
      store.navigateTo(j.screen);
    });
  });

  return container;
}
