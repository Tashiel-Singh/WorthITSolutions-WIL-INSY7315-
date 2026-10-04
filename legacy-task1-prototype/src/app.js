/**
 * Main Application Orchestrator & 12-Screen Prototype Router
 */
import { store } from './store/state.js';
import { renderHeader } from './components/common/Header.js';
import { renderSidebar } from './components/common/Sidebar.js';

// 12 Prototype Screens
import { renderLoginScreen } from './components/screens/LoginScreen.js'; // Screen 1
import { renderDashboardScreen } from './components/screens/DashboardScreen.js'; // Screen 2
import { renderTaxEngineScreen } from './components/screens/TaxEngineScreen.js'; // Screen 3
import { renderRevenueSegregationScreen } from './components/screens/RevenueSegregationScreen.js'; // Screen 4
import { renderInventoryStockScreen } from './components/screens/InventoryStockScreen.js'; // Screen 5
import { renderBulkSegregationScreen } from './components/screens/BulkSegregationScreen.js'; // Screen 6
import { renderBulkOrderScreen } from './components/screens/BulkOrderScreen.js'; // Screen 7
import { renderInvoicingScreen } from './components/screens/InvoicingScreen.js'; // Screen 8
import { renderOrderManagementScreen } from './components/screens/OrderManagementScreen.js'; // Screen 9
import { renderPaymentRemindersScreen } from './components/screens/PaymentRemindersScreen.js'; // Screen 10
import { renderExecutiveDashboardScreen } from './components/screens/ExecutiveDashboardScreen.js'; // Screen 11
import { renderSettingsScreen } from './components/screens/SettingsScreen.js'; // Screen 12

export function createApp() {
  const root = document.getElementById('app');

  function render() {
    const state = store.getState();
    root.innerHTML = '';

    // Apply system/light/dark theme
    store.applyTheme();

    // If unauthenticated or on login screen -> Screen 1
    if (!state.currentUser || state.currentScreen === 'login') {
      root.appendChild(renderLoginScreen());
      return;
    }

    // App Layout Container
    const isCollapsed = state.isSidebarCollapsed;
    const layout = document.createElement('div');
    layout.className = `app-layout ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-open'}`;

    // Mobile Backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'sidebar-backdrop';
    backdrop.addEventListener('click', () => {
      store.toggleSidebar();
    });
    layout.appendChild(backdrop);

    // Left Navigation Sidebar
    const sidebar = renderSidebar();
    layout.appendChild(sidebar);

    // Main Content Wrapper
    const mainWrapper = document.createElement('div');
    mainWrapper.className = 'main-wrapper';

    // Top Navigation Header
    const header = renderHeader();
    mainWrapper.appendChild(header);

    // Dynamic Screen Routing
    let screenElement;

    switch (state.currentScreen) {
      case 'dashboard':
        screenElement = renderDashboardScreen();
        break;
      case 'tax-engine':
        screenElement = renderTaxEngineScreen();
        break;
      case 'revenue-segregation':
        screenElement = renderRevenueSegregationScreen();
        break;
      case 'inventory-overview':
        screenElement = renderInventoryStockScreen();
        break;
      case 'bulk-segregation':
        screenElement = renderBulkSegregationScreen();
        break;
      case 'bulk-order':
        screenElement = renderBulkOrderScreen();
        break;
      case 'invoicing':
        screenElement = renderInvoicingScreen();
        break;
      case 'order-management':
        screenElement = renderOrderManagementScreen();
        break;
      case 'payment-reminders':
        screenElement = renderPaymentRemindersScreen();
        break;
      case 'executive-dashboard':
        screenElement = renderExecutiveDashboardScreen();
        break;
      case 'settings':
        screenElement = renderSettingsScreen();
        break;
      default:
        screenElement = renderDashboardScreen();
    }

    if (screenElement) {
      mainWrapper.appendChild(screenElement);
    }

    layout.appendChild(mainWrapper);
    root.appendChild(layout);
  }

  // Subscribe to state updates for instantaneous re-rendering
  store.subscribe(() => {
    render();
  });

  // Initial render
  render();
}
