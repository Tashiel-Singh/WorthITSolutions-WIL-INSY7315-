/**
 * Screen 12: Settings & Profile
 * Caption: Figure 12: Settings & Profile - User configuration, automated notification rules, and enterprise integrations.
 */
import { store } from '../../store/state.js';
import { Icons } from '../common/Icons.js';
import { showToast } from '../common/Toast.js';
import { openModal } from '../common/Modal.js';

export function renderSettingsScreen() {
  const state = store.getState();
  const user = state.currentUser;
  const company = state.companyInfo;
  const theme = state.theme;

  const container = document.createElement('div');
  container.className = 'page-content';

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1>System Settings & User Profile</h1>
        <p>Enterprise configuration, role permissions, POS sync, and automated compliance rules.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" id="btn-back-dashboard">
          ← Dashboard
        </button>
      </div>
    </div>

    <div class="grid-cols-2">
      <!-- User Profile Card -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">${Icons.user} User Profile & Role</div>
            <div class="card-subtitle">Active authenticated session details</div>
          </div>
          <span class="badge badge-info" style="text-transform: uppercase;">${user.role}</span>
        </div>

        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
          <div class="user-avatar" style="width: 52px; height: 52px; font-size: 1.25rem;">
            ${user.avatarInitials || 'JA'}
          </div>
          <div>
            <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary);">${user.name}</h2>
            <div style="font-size: 0.8125rem; color: var(--text-secondary);">${user.title || 'Managing Director'}</div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.85rem; font-size: 0.875rem;">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.5rem;">
            <span style="color: var(--text-muted);">Email Address:</span>
            <strong style="color: var(--text-primary);">${user.email}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.5rem;">
            <span style="color: var(--text-muted);">Overhead Business Entity:</span>
            <strong style="color: var(--text-primary);">${company.name}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.5rem;">
            <span style="color: var(--text-muted);">Physical Headquarters:</span>
            <span style="color: var(--text-primary); text-align: right; max-width: 60%;">${company.address}</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.5rem;">
            <span style="color: var(--text-muted);">Contact & VAT:</span>
            <span style="color: var(--text-primary);">${company.phone} • VAT: ${company.vatNumber}</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.5rem;">
            <span style="color: var(--text-muted);">Application Architecture:</span>
            <span class="badge badge-info">MedFlow v2.4 Enterprise</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.5rem;">
            <span style="color: var(--text-muted);">Development Team:</span>
            <span style="color: var(--color-primary); font-weight: 700;">WorthIT Solutions</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Assigned Role Access:</span>
            <span class="badge badge-success">Full System Administrator</span>
          </div>
        </div>

        <!-- Theme Selection in Settings -->
        <div style="margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--border-subtle);">
          <label class="form-label">Appearance & Display Theme</label>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.35rem;">
            <button class="btn btn-sm ${theme === 'system' ? 'btn-primary' : 'btn-secondary'} btn-set-theme" data-mode="system">
              Auto (System OS)
            </button>
            <button class="btn btn-sm ${theme === 'light' ? 'btn-primary' : 'btn-secondary'} btn-set-theme" data-mode="light">
              Light Mode
            </button>
            <button class="btn btn-sm ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'} btn-set-theme" data-mode="dark">
              Dark Mode
            </button>
          </div>
        </div>
      </div>

      <!-- Enterprise Integrations & Notification Rules -->
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <!-- Integrations Card -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">${Icons.shield} External Integrations</div>
              <div class="card-subtitle">Retail POS and accounting software bridges</div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: var(--bg-surface-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              <div>
                <strong style="color: var(--text-primary); font-size: 0.875rem;">Retail Point-of-Sale (POS) Integration</strong>
                <div style="font-size: 0.72rem; color: var(--text-muted);">Real-time deduction from Retail inventory pool only</div>
              </div>
              <span class="badge badge-success">✓ Active (Port 8443)</span>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: var(--bg-surface-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
              <div>
                <strong style="color: var(--text-primary); font-size: 0.875rem;">Accounting Software (Sage / Xero Bridge)</strong>
                <div style="font-size: 0.72rem; color: var(--text-muted);">Automated invoice posting and VAT ledger synchronization</div>
              </div>
              <span class="badge badge-success">✓ Synced Daily</span>
            </div>
          </div>
        </div>

        <!-- System Reset & Maintenance Card -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Prototype State Maintenance</div>
              <div class="card-subtitle">Reset demo data and test streams</div>
            </div>
          </div>

          <p style="font-size: 0.8125rem; color: var(--text-secondary); margin-bottom: 1rem;">
            You can restore all mock data (invoices, orders, stock pools, and tax calculations) back to the clean demonstration seed state.
          </p>

          <button class="btn btn-secondary btn-sm" id="btn-reset-prototype-data" style="color: var(--status-danger);">
            ${Icons.refresh} Reset All Demo Data to Defaults
          </button>
        </div>
      </div>
    </div>
  `;

  // Theme buttons in settings
  container.querySelectorAll('.btn-set-theme').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      store.setTheme(mode);
      showToast('Theme Updated', `Switched theme to ${mode.toUpperCase()}.`, 'info');
    });
  });

  // Reset demo data
  container.querySelector('#btn-reset-prototype-data')?.addEventListener('click', () => {
    store.resetToDefaults();
    showToast('Data Reset', 'All inventory, order, and tax mock data restored to default state.', 'success');
  });

  container.querySelector('#btn-back-dashboard')?.addEventListener('click', () => {
    store.navigateTo('dashboard');
  });

  return container;
}
