/**
 * System Audit Logs & Compliance Stream (Admin)
 */
import { store } from '../../store/state.js';
import { Icons } from '../common/Icons.js';
import { showToast } from '../common/Toast.js';

export function renderAuditLogsView() {
  const state = store.getState();
  let logs = [...state.auditLogs];
  let selectedCategory = 'all';
  let searchTerm = '';

  const container = document.createElement('div');
  container.className = 'page-content';

  function renderContent() {
    let filtered = logs.filter((log) => {
      const matchCat = selectedCategory === 'all' || log.category === selectedCategory;
      const matchSearch =
        !searchTerm ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });

    container.innerHTML = `
      <div class="page-header">
        <div class="page-title-group">
          <h1>System Audit & Compliance Log</h1>
          <p>Chronological security and activity audit stream across all clinical, inventory, and authentication events.</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-secondary" id="btn-export-logs">
            ${Icons.records} Export Audit Log
          </button>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="card" style="margin-bottom: 1.5rem; padding: 1.25rem;">
        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
          <div class="search-input-wrapper" style="flex: 1; min-width: 260px;">
            <span class="search-icon-inside">${Icons.search}</span>
            <input 
              type="text" 
              id="audit-search-input" 
              class="form-input search-input" 
              placeholder="Search audit trail for actions, users, or details..." 
              value="${searchTerm}"
            />
          </div>

          <div style="min-width: 180px;">
            <select id="audit-category-filter" class="form-select">
              <option value="all" ${selectedCategory === 'all' ? 'selected' : ''}>All Event Categories</option>
              <option value="inventory" ${selectedCategory === 'inventory' ? 'selected' : ''}>Inventory & Stock</option>
              <option value="clinical" ${selectedCategory === 'clinical' ? 'selected' : ''}>Clinical & Prescriptions</option>
              <option value="appointments" ${selectedCategory === 'appointments' ? 'selected' : ''}>Appointments</option>
              <option value="auth" ${selectedCategory === 'auth' ? 'selected' : ''}>Authentication & Roles</option>
              <option value="admin" ${selectedCategory === 'admin' ? 'selected' : ''}>Admin & User Ops</option>
            </select>
          </div>

          <div style="font-size: 0.8125rem; color: var(--text-muted);">
            Recorded Events: <strong>${filtered.length}</strong>
          </div>
        </div>
      </div>

      <!-- Audit Logs Table -->
      <div class="card" style="padding: 0;">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Event Time</th>
                <th>Action</th>
                <th>Initiated By</th>
                <th>Category</th>
                <th>Event Description & Details</th>
              </tr>
            </thead>
            <tbody>
              ${
                filtered.length === 0
                  ? `<tr><td colspan="5" style="text-align: center; padding: 3rem; color: var(--text-muted);">No audit records found.</td></tr>`
                  : filtered
                      .map(
                        (l) => `
                <tr>
                  <td style="font-family: var(--font-mono); font-size: 0.78125rem; color: var(--text-secondary); white-space: nowrap;">
                    ${l.timestamp}
                  </td>
                  <td>
                    <strong style="color: #fff;">${l.action}</strong>
                  </td>
                  <td>
                    <span style="display: inline-flex; align-items: center; gap: 0.35rem; color: var(--text-secondary); font-size: 0.8125rem;">
                      ${Icons.user} ${l.user}
                    </span>
                  </td>
                  <td>
                    <span class="badge badge-info" style="text-transform: capitalize;">
                      ${l.category}
                    </span>
                  </td>
                  <td>
                    <span style="color: var(--text-secondary); font-size: 0.875rem;">${l.detail}</span>
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

    container.querySelector('#audit-search-input')?.addEventListener('input', (e) => {
      searchTerm = e.target.value;
      renderContent();
    });

    container.querySelector('#audit-category-filter')?.addEventListener('change', (e) => {
      selectedCategory = e.target.value;
      renderContent();
    });

    container.querySelector('#btn-export-logs')?.addEventListener('click', () => {
      showToast('Export Generated', 'Audit log JSON stream copied to clipboard (simulated).', 'success');
    });
  }

  renderContent();
  return container;
}
