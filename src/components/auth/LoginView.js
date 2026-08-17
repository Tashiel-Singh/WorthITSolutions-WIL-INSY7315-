/**
 * Login & Role Selection Portal
 */
import { store } from '../../store/state.js';
import { Icons } from '../common/Icons.js';
import { showToast } from '../common/Toast.js';

export function renderLoginView() {
  const container = document.createElement('div');
  container.className = 'login-wrapper';

  container.innerHTML = `
    <div class="login-glow-circle login-glow-1"></div>
    <div class="login-glow-circle login-glow-2"></div>

    <div class="login-card">
      <!-- Left side: Login Actions -->
      <div class="login-main">
        <div class="login-brand-badge">
          ${Icons.shield} CareSync Pro v2.4 Enterprise
        </div>
        
        <h1 class="login-heading">Welcome Back</h1>
        <p class="login-subtitle">Select a demo role profile or enter your credentials to access the secure healthcare portal.</p>

        <!-- Quick 1-Click Role Login Cards -->
        <div style="margin-bottom: 0.75rem; font-size: 0.78125rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em;">
          Fast Demo Role Sign-In
        </div>

        <div class="role-cards-grid">
          <!-- Admin Card -->
          <div class="role-select-card" data-role="admin" data-user="user-admin-1" style="--card-role-color: #6366f1; --card-role-bg: rgba(99, 102, 241, 0.12);">
            <div class="role-select-icon" style="background: linear-gradient(135deg, #6366f1, #4338ca);">
              ${Icons.shield}
            </div>
            <div class="role-select-info">
              <div class="role-select-title">
                Administrator
                <span class="role-select-badge">Full Control</span>
              </div>
              <div class="role-select-desc">John Admin — Inventory restock, staff directory & analytics</div>
            </div>
            <button class="btn btn-sm btn-primary" style="background: #6366f1;">Sign In</button>
          </div>

          <!-- Doctor Card -->
          <div class="role-select-card" data-role="doctor" data-user="user-doc-1" style="--card-role-color: #0d9488; --card-role-bg: rgba(13, 148, 136, 0.12);">
            <div class="role-select-icon" style="background: linear-gradient(135deg, #0d9488, #047857);">
              ${Icons.stethoscope}
            </div>
            <div class="role-select-info">
              <div class="role-select-title">
                Medical Doctor
                <span class="role-select-badge">Clinical</span>
              </div>
              <div class="role-select-desc">Dr. Sarah Smith — Patient records, consultations & prescriptions</div>
            </div>
            <button class="btn btn-sm btn-primary" style="background: #0d9488;">Sign In</button>
          </div>

          <!-- Client / Patient Card -->
          <div class="role-select-card" data-role="client" data-user="user-client-1" style="--card-role-color: #2563eb; --card-role-bg: rgba(37, 99, 235, 0.12);">
            <div class="role-select-icon" style="background: linear-gradient(135deg, #2563eb, #0284c7);">
              ${Icons.user}
            </div>
            <div class="role-select-info">
              <div class="role-select-title">
                Patient / Client
                <span class="role-select-badge">Self-Service</span>
              </div>
              <div class="role-select-desc">Emily Chen — Book visits, manage prescriptions & vitals</div>
            </div>
            <button class="btn btn-sm btn-primary" style="background: #2563eb;">Sign In</button>
          </div>
        </div>

        <div style="display: flex; align-items: center; margin: 1.5rem 0; gap: 1rem;">
          <div style="flex: 1; height: 1px; background: var(--border-subtle);"></div>
          <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Or Login Manually</span>
          <div style="flex: 1; height: 1px; background: var(--border-subtle);"></div>
        </div>

        <form id="login-form">
          <div class="form-group">
            <label class="form-label" for="username">Username</label>
            <div class="search-input-wrapper">
              <span class="search-icon-inside">${Icons.user}</span>
              <input 
                type="text" 
                id="username" 
                class="form-input search-input" 
                placeholder="e.g. admin, dr.smith, emily.chen" 
                value="admin"
                required 
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              class="form-input" 
              placeholder="Enter password" 
              value="password123"
              required 
            />
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem; height: 42px;">
            Authenticate Session
          </button>
        </form>
      </div>

      <!-- Right side: Role Separation Breakdown -->
      <div class="login-side">
        <div>
          <h3 style="font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 0.75rem;">
            Unified Role Separation
          </h3>
          <p style="font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">
            CareSync Pro enforces strict role-based data isolation and workflow segregation across hospital departments.
          </p>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="padding: 0.85rem; border-radius: var(--radius-md); background: rgba(99, 102, 241, 0.08); border-left: 3px solid #6366f1;">
              <div style="font-weight: 700; font-size: 0.8125rem; color: #818cf8;">Admin Workspace</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">
                Manage global inventory thresholds, SKU pricing, staff credentials, and compliance audit streams.
              </div>
            </div>

            <div style="padding: 0.85rem; border-radius: var(--radius-md); background: rgba(13, 148, 136, 0.08); border-left: 3px solid #0d9488;">
              <div style="font-weight: 700; font-size: 0.8125rem; color: #2dd4bf;">Doctor Portal</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">
                Access patient charts, write inventory-linked prescriptions, and update consultation notes in real time.
              </div>
            </div>

            <div style="padding: 0.85rem; border-radius: var(--radius-md); background: rgba(37, 99, 235, 0.08); border-left: 3px solid #2563eb;">
              <div style="font-weight: 700; font-size: 0.8125rem; color: #60a5fa;">Client / Patient Suite</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">
                Schedule appointments with specialized doctors, track active prescriptions, and request one-click refills.
              </div>
            </div>
          </div>
        </div>

        <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted);">
          <span>Default Demo Password: <strong>password123</strong></span>
          <button id="btn-reset-store" class="btn btn-sm btn-secondary" style="font-size: 0.7rem;">Reset Data</button>
        </div>
      </div>
    </div>
  `;

  // Attach event handlers
  // Quick Role cards
  container.querySelectorAll('.role-select-card').forEach((card) => {
    card.addEventListener('click', () => {
      const role = card.getAttribute('data-role');
      const userId = card.getAttribute('data-user');
      const res = store.quickLoginAs(role, userId);
      if (res.success) {
        showToast(
          `Logged in as ${res.user.name}`,
          `Role: ${res.user.role.toUpperCase()} — Welcome back!`,
          'success'
        );
      }
    });
  });

  // Manual Form Submit
  const form = container.querySelector('#login-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = container.querySelector('#username').value;
    const password = container.querySelector('#password').value;

    const res = store.login(username, password);
    if (res.success) {
      showToast(
        `Welcome, ${res.user.name}!`,
        `Authenticated as ${res.user.role.toUpperCase()}`,
        'success'
      );
    } else {
      showToast('Authentication Failed', res.message, 'error');
    }
  });

  // Reset Data handler
  container.querySelector('#btn-reset-store')?.addEventListener('click', () => {
    store.resetToDefaults();
    showToast('Store Reset', 'Demo database restored to default seed state.', 'info');
  });

  return container;
}
