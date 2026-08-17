/**
 * Central State Store with System Theme Detection and 12-Screen Navigation Flow
 */
import {
  initialCompanyInfo,
  initialUsers,
  initialProducts,
  initialClients,
  initialOrders,
  initialInvoices,
  initialRemindersLog,
  revenueMonthlyData
} from '../data/mockData.js';

const STORAGE_KEY = 'worthit_wil_prototype_state_v4';

class StateStore {
  constructor() {
    this.subscribers = new Set();
    this.state = this.loadState();
    this.initThemeListener();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure admin user name is synchronized to John Admin
        if (parsed.users && parsed.users[0]) {
          parsed.users[0].name = 'John Admin';
          parsed.users[0].avatarInitials = 'JA';
        }
        if (parsed.currentUser && parsed.currentUser.id === 'user-admin-1') {
          parsed.currentUser.name = 'John Admin';
          parsed.currentUser.avatarInitials = 'JA';
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Could not load saved state:', e);
    }

    return {
      theme: 'system', // 'system' | 'light' | 'dark'
      currentUser: initialUsers[0], // John Admin (Admin)
      currentScreen: 'dashboard', // Screen 2 default when logged in
      isSidebarCollapsed: false,
      companyInfo: initialCompanyInfo,
      users: [...initialUsers],
      products: [...initialProducts],
      clients: [...initialClients],
      orders: [...initialOrders],
      invoices: [...initialInvoices],
      remindersLog: [...initialRemindersLog],
      revenueData: [...revenueMonthlyData],
      reminderSettings: {
        day7: true,
        day3: true,
        day1: true
      },
      lastTaxCalculation: {
        totalAssets: 450000,
        operationalExpenses: 280000,
        bulkRevenue: 520000,
        totalDeductionPct: 24.5,
        depreciationDeduction: 67500,
        operationalDeduction: 280000,
        vatInputClaim: 78000,
        taxLiabilityReducedPct: 22.8
      },
      activeInvoiceId: 'INV-2026-109',
      activeProductId: 'PRD-101'
    };
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Could not save state:', e);
    }
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.subscribers.add(listener);
    return () => this.subscribers.delete(listener);
  }

  notify() {
    this.saveState();
    this.applyTheme();
    this.subscribers.forEach((fn) => {
      try {
        fn(this.state);
      } catch (err) {
        console.error('Error in subscriber:', err);
      }
    });
  }

  // Theme Management (System / Light / Dark)
  setTheme(theme) {
    this.state.theme = theme;
    this.applyTheme();
    this.notify();
  }

  applyTheme() {
    const theme = this.state.theme;
    const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (theme === 'dark' || (theme === 'system' && isSystemDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  initThemeListener() {
    this.applyTheme();
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this.state.theme === 'system') {
          this.applyTheme();
          this.notify();
        }
      });
    }
  }

  // Navigation
  navigateTo(screenId, params = {}) {
    this.state.currentScreen = screenId;
    if (params.invoiceId) this.state.activeInvoiceId = params.invoiceId;
    if (params.productId) this.state.activeProductId = params.productId;
    this.notify();
  }

  toggleSidebar() {
    this.state.isSidebarCollapsed = !this.state.isSidebarCollapsed;
    this.notify();
  }

  // Auth
  login(username, password) {
    const user = this.state.users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (!user) {
      return { success: false, message: 'User not found in system directory.' };
    }
    if (user.password !== password) {
      return { success: false, message: 'Invalid credentials entered.' };
    }

    this.state.currentUser = user;
    this.state.currentScreen = 'dashboard';
    this.notify();
    return { success: true, user };
  }

  quickLogin(userId) {
    const user = this.state.users.find((u) => u.id === userId) || this.state.users[0];
    this.state.currentUser = user;
    this.state.currentScreen = 'dashboard';
    this.notify();
    return { success: true, user };
  }

  logout() {
    this.state.currentUser = null;
    this.state.currentScreen = 'login';
    this.notify();
  }

  // Tax Engine Calculation
  calculateTaxDeduction(assets, opsExpenses, bulkRev) {
    const totalAssets = parseFloat(assets) || 0;
    const operationalExpenses = parseFloat(opsExpenses) || 0;
    const bulkRevenue = parseFloat(bulkRev) || 0;

    // SARS wear and tear depreciation estimate (~15% on clinical equipment & furniture assets)
    const depreciationDeduction = totalAssets * 0.15;
    const operationalDeduction = operationalExpenses;
    // VAT input claims on bulk goods & supplies (15/115 ~ 13.04%)
    const vatInputClaim = (bulkRevenue * 0.15);

    const totalDeductions = depreciationDeduction + operationalDeduction + vatInputClaim;
    const totalBase = totalAssets + operationalExpenses + bulkRevenue;
    const totalDeductionPct = totalBase > 0 ? ((totalDeductions / totalBase) * 100).toFixed(1) : '24.5';
    const taxLiabilityReducedPct = ((totalDeductions / (totalAssets + operationalExpenses)) * 18.5).toFixed(1);

    this.state.lastTaxCalculation = {
      totalAssets,
      operationalExpenses,
      bulkRevenue,
      totalDeductionPct,
      depreciationDeduction,
      operationalDeduction,
      vatInputClaim,
      taxLiabilityReducedPct: Math.min(38, Math.max(15, parseFloat(taxLiabilityReducedPct)))
    };

    this.notify();
    return this.state.lastTaxCalculation;
  }

  // Inventory & Segregation
  reorderProduct(productId, pool = 'retail', quantity = 50) {
    const product = this.state.products.find((p) => p.id === productId);
    if (!product) return false;

    if (pool === 'retail') {
      product.retailStock += quantity;
    } else {
      product.bulkStock += quantity;
    }

    if (product.retailStock + product.bulkStock > product.reorderLevel) {
      product.status = 'In Stock';
    }

    this.notify();
    return true;
  }

  // Bulk Order Placement -> generates order and links to invoice
  placeBulkOrder(orderData) {
    const newOrderId = `ORD-${Math.floor(8050 + Math.random() * 900)}`;
    const newInvoiceId = `INV-2026-${Math.floor(110 + Math.random() * 90)}`;

    const newOrder = {
      id: newOrderId,
      clientName: orderData.clientName,
      clientId: orderData.clientId,
      orderDate: new Date().toISOString().split('T')[0],
      type: 'Bulk Order',
      items: orderData.items,
      subtotal: orderData.subtotal,
      discountAmount: orderData.discountAmount,
      vatAmount: orderData.vatAmount,
      totalAmount: orderData.totalAmount,
      status: 'Processing'
    };

    // Deduct from bulk stock
    orderData.items.forEach((item) => {
      const prod = this.state.products.find((p) => p.name === item.productName);
      if (prod) {
        prod.bulkStock = Math.max(0, prod.bulkStock - item.quantity);
      }
    });

    this.state.orders.unshift(newOrder);

    // Create corresponding invoice
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    const newInvoice = {
      id: newInvoiceId,
      orderId: newOrderId,
      clientName: orderData.clientName,
      clientId: orderData.clientId,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      subtotal: orderData.subtotal - orderData.discountAmount,
      vatRate: 0.15,
      vatAmount: orderData.vatAmount,
      totalAmount: orderData.totalAmount,
      status: 'Pending',
      daysOverdue: 0,
      items: orderData.items.map((it) => ({
        description: `${it.productName} (Bulk Pack)`,
        qty: Math.ceil(it.quantity / 12) || 1,
        unitPrice: it.unitPrice * (it.quantity > 12 ? 12 : 1),
        total: it.unitPrice * it.quantity
      }))
    };

    this.state.invoices.unshift(newInvoice);
    this.state.activeInvoiceId = newInvoiceId;

    this.notify();
    return { order: newOrder, invoice: newInvoice };
  }

  updateOrderStatus(orderId, newStatus) {
    const order = this.state.orders.find((o) => o.id === orderId);
    if (order) {
      order.status = newStatus;
      this.notify();
      return true;
    }
    return false;
  }

  // Payment Reminders
  sendPaymentReminder(invoiceId) {
    const invoice = this.state.invoices.find((i) => i.id === invoiceId);
    if (!invoice) return false;

    const newRem = {
      id: `REM-${Date.now().toString().slice(-4)}`,
      invoiceId: invoice.id,
      clientName: invoice.clientName,
      amount: `R ${invoice.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      sentDate: new Date().toLocaleString(),
      channel: 'Automated Email + SMS',
      status: 'Delivered',
      stage: `${invoice.daysOverdue}-Day Overdue Notice`
    };

    this.state.remindersLog.unshift(newRem);
    this.notify();
    return newRem;
  }

  toggleReminderSetting(key) {
    if (this.state.reminderSettings[key] !== undefined) {
      this.state.reminderSettings[key] = !this.state.reminderSettings[key];
      this.notify();
    }
  }

  resetToDefaults() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = this.loadState();
    this.applyTheme();
    this.notify();
  }
}

export const store = new StateStore();
