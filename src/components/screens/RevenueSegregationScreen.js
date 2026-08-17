/**
 * Screen 4: Revenue Segregation Dashboard
 * Caption: Figure 4: Revenue Segregation Dashboard - Visual breakdown of Retail vs. Bulk revenue streams.
 */
import { store } from '../../store/state.js';
import { Icons } from '../common/Icons.js';

export function renderRevenueSegregationScreen() {
  const state = store.getState();
  const revenueData = state.revenueData;

  let selectedCategory = 'all';

  const container = document.createElement('div');
  container.className = 'page-content';

  function renderContent() {
    container.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>Revenue Segregation Dashboard</h1>
          <p>Analytical breakdown isolating direct Retail sales (45%) from high-volume B2B Bulk clinic orders (55%).</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-secondary" id="btn-back-dashboard">
            ← Dashboard
          </button>
          <button class="btn btn-primary" id="btn-next-screen5">
            Next: Stock Overview →
          </button>
        </div>
      </div>

      <!-- Main Visual Section: Donut/Pie Segregation + 6-Month Trajectory -->
      <div class="grid-cols-2">
        <!-- Interactive Pie / Stream Split Card -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">${Icons.records} Retail vs. Bulk Revenue Split</div>
              <div class="card-subtitle">Current financial quarter stream contribution</div>
            </div>
            <span class="badge badge-success">Segregated</span>
          </div>

          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem 0;">
            <!-- CSS Donut Chart -->
            <div style="position: relative; width: 170px; height: 170px; border-radius: 50%; background: conic-gradient(#2563eb 0% 45%, #10b981 45% 100%); display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-md);">
              <div style="width: 110px; height: 110px; border-radius: 50%; background: var(--bg-card); display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Total Streams</span>
                <span style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary);">100%</span>
              </div>
            </div>

            <!-- Legend with metrics -->
            <div style="display: flex; gap: 2rem; margin-top: 1.5rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <div style="width: 12px; height: 12px; border-radius: 3px; background: #2563eb;"></div>
                <div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Retail Stream</div>
                  <strong style="color: #2563eb; font-size: 1.1rem;">45%</strong>
                  <div style="font-size: 0.7rem; color: var(--text-secondary);">Direct Consumer</div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <div style="width: 12px; height: 12px; border-radius: 3px; background: #10b981;"></div>
                <div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Bulk B2B Stream</div>
                  <strong style="color: #10b981; font-size: 1.1rem;">55%</strong>
                  <div style="font-size: 0.7rem; color: var(--text-secondary);">Clinics & Practices</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 6-Month Trajectory Chart -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">${Icons.activity} 6-Month Revenue Trajectory (May - Oct)</div>
              <div class="card-subtitle">Consistent growth trajectory demonstrating 45% uplift</div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem; padding-top: 0.5rem;">
            ${revenueData
              .map(
                (m) => `
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; margin-bottom: 0.35rem;">
                  <span style="font-weight: 600; color: var(--text-primary);">${m.month}</span>
                  <span style="font-weight: 700; color: var(--status-success);">${m.totalGrowth} (R ${(m.retailRevenue + m.bulkRevenue).toLocaleString()})</span>
                </div>
                <div class="pie-split-bar">
                  <div class="pie-seg-retail" style="width: ${m.retailPercent}%;">Retail ${m.retailPercent}%</div>
                  <div class="pie-seg-bulk" style="width: ${m.bulkPercent}%;">Bulk ${m.bulkPercent}%</div>
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>

      <!-- Monthly Breakdown Table with Category Filter -->
      <div class="card" style="margin-top: 1.5rem; padding: 0;">
        <div style="padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div class="card-title">Monthly Segregated Stream Breakdown</div>
            <div class="card-subtitle">Granular performance across historical and forecasted months</div>
          </div>
          <div style="min-width: 200px;">
            <select id="rev-category-filter" class="form-select">
              <option value="all" ${selectedCategory === 'all' ? 'selected' : ''}>All Categories (Homeopathic + Furniture)</option>
              <option value="Homeopathic" ${selectedCategory === 'Homeopathic' ? 'selected' : ''}>Homeopathic Remedies Only</option>
              <option value="Furniture" ${selectedCategory === 'Furniture' ? 'selected' : ''}>Clinic Furniture Only</option>
            </select>
          </div>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Month & Period</th>
                <th>Retail Revenue Share (%)</th>
                <th>Bulk B2B Revenue Share (%)</th>
                <th>Retail Sales (Rands)</th>
                <th>Bulk Sales (Rands)</th>
                <th>Overall Growth Rate</th>
              </tr>
            </thead>
            <tbody>
              ${revenueData
                .map(
                  (row) => `
                <tr>
                  <td>
                    <strong style="color: var(--text-primary);">${row.month}</strong>
                  </td>
                  <td>
                    <span class="badge badge-retail">${row.retailPercent}%</span>
                  </td>
                  <td>
                    <span class="badge badge-bulk">${row.bulkPercent}%</span>
                  </td>
                  <td>
                    <span>R ${row.retailRevenue.toLocaleString()}</span>
                  </td>
                  <td>
                    <strong>R ${row.bulkRevenue.toLocaleString()}</strong>
                  </td>
                  <td>
                    <strong style="color: var(--status-success);">${row.totalGrowth}</strong>
                  </td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Filter change
    container.querySelector('#rev-category-filter')?.addEventListener('change', (e) => {
      selectedCategory = e.target.value;
      renderContent();
    });

    container.querySelector('#btn-back-dashboard')?.addEventListener('click', () => {
      store.navigateTo('dashboard');
    });

    container.querySelector('#btn-next-screen5')?.addEventListener('click', () => {
      store.navigateTo('inventory-overview');
    });
  }

  renderContent();
  return container;
}
