/**
 * Complete 12-Screen Navigation Sidebar
 */
import { store } from '../../store/state.js';
import { Icons } from './Icons.js';

export function renderSidebar() {
  const state = store.getState();
  const currentScreen = state.currentScreen;

  const lowStockCount = state.products.filter(
    (p) => p.status === 'Low Stock' || p.status === 'Out of Stock'
  ).length;

  const overdueCount = state.invoices.filter((i) => i.status === 'Overdue').length;

  const sidebar = document.createElement('aside');
  sidebar.className = 'app-sidebar';

  const navSections = [
    {
      section: 'Overview & Analytics',
      items: [
        { id: 'dashboard', label: 'Main Dashboard', icon: Icons.dashboard },
        { id: 'executive-dashboard', label: 'Executive Dashboard', icon: Icons.activity }
      ]
    },
    {
      section: 'Financial Management',
      items: [
        { id: 'tax-engine', label: 'Tax Deduction Engine', icon: Icons.shield },
        { id: 'revenue-segregation', label: 'Revenue Segregation', icon: Icons.records }
      ]
    },
    {
      section: 'Inventory Management',
      items: [
        {
          id: 'inventory-overview',
          label: 'Stock Overview',
          icon: Icons.inventory,
          badge: lowStockCount > 0 ? `${lowStockCount} Low` : null,
          badgeClass: 'badge-warning'
        },
        { id: 'bulk-segregation', label: 'Bulk / Retail Segregation', icon: Icons.activity }
      ]
    },
    {
      section: 'Operations & Invoicing',
      items: [
        { id: 'bulk-order', label: 'Bulk Order Portal', icon: Icons.plus },
        { id: 'invoicing', label: 'Automated Invoicing', icon: Icons.records },
        { id: 'order-management', label: 'Order Management', icon: Icons.appointments },
        {
          id: 'payment-reminders',
          label: 'Payment Reminders',
          icon: Icons.bell,
          badge: overdueCount > 0 ? `${overdueCount} Overdue` : null,
          badgeClass: 'badge-danger'
        }
      ]
    },
    {
      section: 'System & Admin',
      items: [
        { id: 'settings', label: 'Settings & Profile', icon: Icons.users }
      ]
    }
  ];

  let navHtml = '';
  navSections.forEach((group) => {
    navHtml += `<div class="nav-section-title">${group.section}</div>`;
    group.items.forEach((item) => {
      const isActive = currentScreen === item.id;
      navHtml += `
        <a href="#" class="nav-item ${isActive ? 'active' : ''}" data-screen="${item.id}">
          <span class="nav-icon">${item.icon}</span>
          <span class="nav-label">${item.label}</span>
          ${
            item.badge
              ? `<span class="badge ${item.badgeClass || 'badge-warning'}" style="font-size: 0.65rem; padding: 0.1rem 0.35rem; margin-left: auto;">${item.badge}</span>`
              : ''
          }
        </a>
      `;
    });
  });

  sidebar.innerHTML = `
    <div class="sidebar-brand">
      <div class="brand-icon">
        ${Icons.medicalCross}
      </div>
      <div class="brand-text">
        <span class="brand-title">MedFlow</span>
        <span class="brand-subtitle">Rolling Stoned Natural Health</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      ${navHtml}
    </nav>

    <div class="sidebar-footer">
      <div style="font-size: 0.72rem; color: #a7f3d0; display: flex; flex-direction: column; gap: 0.2rem;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span>System Status</span>
          <span class="badge badge-success" style="font-size: 0.65rem;">Operational</span>
        </div>
        <div style="font-size: 0.68rem; color: #6ee7b7; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 0.35rem; margin-top: 0.25rem;">
          Rolling Stoned Natural Health & Clinic Management
        </div>
      </div>
    </div>
  `;

  // Attach navigation click events
  sidebar.querySelectorAll('.nav-item').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const screenId = item.getAttribute('data-screen');
      store.navigateTo(screenId);
      if (window.innerWidth <= 768 && !store.state.isSidebarCollapsed) {
        store.toggleSidebar();
      }
    });
  });

  return sidebar;
}
