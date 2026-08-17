/**
 * Global Header with System Light/Dark Theme Switcher & Screen Navigation Breadcrumbs
 */
import { store } from '../../store/state.js';
import { Icons } from './Icons.js';
import { showToast } from './Toast.js';

export function renderHeader() {
  const state = store.getState();
  const user = state.currentUser;
  const currentScreen = state.currentScreen;
  const currentTheme = state.theme;

  const header = document.createElement('header');
  header.className = 'app-header';

  const screenNames = {
    dashboard: 'Main Dashboard',
    'tax-engine': 'Financial Management - Tax Deduction Engine',
    'revenue-segregation': 'Revenue Segregation Dashboard',
    'inventory-overview': 'Inventory Management - Stock Overview',
    'bulk-segregation': 'Bulk / Retail Stock Segregation',
    'bulk-order': 'B2B Bulk Order Portal',
    invoicing: 'Automated Tax Invoicing',
    'order-management': 'Order Management & Tracking',
    'payment-reminders': 'Automated Payment Reminders',
    'executive-dashboard': 'Executive Analytics Dashboard',
    settings: 'System Settings & Profile'
  };

  header.innerHTML = `
    <div class="header-left">
      <button class="header-toggle-btn" id="sidebar-toggle" title="Toggle Navigation Sidebar">
        ${Icons.menu}
      </button>

      <div class="header-breadcrumbs">
        <span class="breadcrumb-parent" id="bc-dashboard">Dashboard</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">${screenNames[currentScreen] || currentScreen}</span>
      </div>
    </div>

    <div class="header-right">
      <!-- System Light/Dark Mode Switcher -->
      <div class="theme-switch-group" title="Select Theme: Auto (System) / Light / Dark">
        <button class="theme-btn ${currentTheme === 'system' ? 'active' : ''}" data-theme-set="system">
          Auto
        </button>
        <button class="theme-btn ${currentTheme === 'light' ? 'active' : ''}" data-theme-set="light">
          Light
        </button>
        <button class="theme-btn ${currentTheme === 'dark' ? 'active' : ''}" data-theme-set="dark">
          Dark
        </button>
      </div>

      <!-- User Profile Menu -->
      <div style="position: relative;">
        <button class="user-profile-btn" id="btn-user-profile">
          <div class="user-avatar">${user?.avatarInitials || 'JA'}</div>
          <div class="user-name">${user?.name || 'John Admin'}</div>
          ${Icons.chevronDown}
        </button>

        <div class="dropdown-menu" id="user-dropdown-menu" style="width: 240px;">
          <div class="dropdown-header">System User</div>
          <div style="padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border-subtle); margin-bottom: 0.5rem;">
            <div style="font-weight: 700; font-size: 0.875rem;">${user?.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${user?.title || user?.role}</div>
          </div>
          <button class="dropdown-item" id="btn-goto-settings">
            ${Icons.records}
            <span>System Settings</span>
          </button>
          <button class="dropdown-item" id="btn-signout" style="color: var(--status-danger);">
            ${Icons.logout}
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  `;

  // Breadcrumb click
  header.querySelector('#bc-dashboard')?.addEventListener('click', () => {
    store.navigateTo('dashboard');
  });

  // Toggle Sidebar
  header.querySelector('#sidebar-toggle')?.addEventListener('click', () => {
    store.toggleSidebar();
  });

  // Theme switch buttons
  header.querySelectorAll('[data-theme-set]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-theme-set');
      store.setTheme(mode);
      showToast('Theme Changed', `Switched theme mode to ${mode.toUpperCase()}.`, 'info');
    });
  });

  // User Profile Dropdown
  const userBtn = header.querySelector('#btn-user-profile');
  const userMenu = header.querySelector('#user-dropdown-menu');
  if (userBtn && userMenu) {
    userBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userMenu.classList.toggle('active');
    });
    document.addEventListener('click', () => {
      userMenu.classList.remove('active');
    });
  }

  // Go to Settings
  header.querySelector('#btn-goto-settings')?.addEventListener('click', () => {
    store.navigateTo('settings');
  });

  // Logout
  header.querySelector('#btn-signout')?.addEventListener('click', () => {
    store.logout();
    showToast('Signed Out', 'You have been signed out of the system.', 'info');
  });

  return header;
}
