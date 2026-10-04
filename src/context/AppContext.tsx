/**
 * Central State Store & Context for Project MedFlow
 */
import React, { createContext, useContext, useState } from 'react';
import {
  UserProfile,
  UserRole,
  Product,
  Order,
  Invoice,
  Prescription,
  StockTransferAudit,
  StockPool,
  OrderStatus,
  RevenueDataPoint,
} from '../types';
import {
  initialUsers,
  initialProducts,
  initialOrders,
  initialInvoices,
  initialPrescriptions,
  initialStockTransfers,
  initialRevenueData,
} from '../data/mockData';

interface AppContextType {
  currentUser: UserProfile;
  switchRole: (role: UserRole) => void;
  products: Product[];
  reorderStock: (productId: string, pool: StockPool, quantity: number) => boolean;
  transferStock: (productId: string, quantity: number, reason: string, notes?: string) => { success: boolean; message: string };
  orders: Order[];
  createOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'orderDate' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  invoices: Invoice[];
  prescriptions: Prescription[];
  requestPrescriptionRefill: (prescriptionId: string) => boolean;
  stockTransfers: StockTransferAudit[];
  revenueData: RevenueDataPoint[];
  activeStockPool: StockPool;
  setActiveStockPool: (pool: StockPool) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(initialUsers[0]); // Thomas (Distributor)
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialPrescriptions);
  const [stockTransfers, setStockTransfers] = useState<StockTransferAudit[]>(initialStockTransfers);
  const [revenueData] = useState<RevenueDataPoint[]>(initialRevenueData);
  const [activeStockPool, setActiveStockPool] = useState<StockPool>('bulk');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const switchRole = (role: UserRole) => {
    const user = initialUsers.find((u) => u.role === role) || initialUsers[0];
    setCurrentUser(user);
  };

  const reorderStock = (productId: string, pool: StockPool, quantity: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const newRetail = pool === 'retail' ? p.retailStock + quantity : p.retailStock;
        const newBulk = pool === 'bulk' ? p.bulkStock + quantity : p.bulkStock;
        let newStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
        if (newRetail === 0 && newBulk === 0) newStatus = 'Out of Stock';
        else if (newRetail < 10 || (newRetail + newBulk) <= p.reorderLevel) newStatus = 'Low Stock';

        return {
          ...p,
          retailStock: newRetail,
          bulkStock: newBulk,
          activeStatus: newStatus,
        };
      })
    );
    return true;
  };

  const transferStock = (
    productId: string,
    quantity: number,
    reason: string,
    notes: string = ''
  ): { success: boolean; message: string } => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return { success: false, message: 'Product not found.' };
    if (quantity <= 0) return { success: false, message: 'Quantity must be greater than zero.' };
    if (prod.bulkStock < quantity) {
      return {
        success: false,
        message: `Insufficient bulk reserve. Available: ${prod.bulkStock} ${prod.unit}s, requested: ${quantity}.`,
      };
    }

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const newBulk = p.bulkStock - quantity;
        const newRetail = p.retailStock + quantity;
        let newStatus: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
        if (newRetail === 0 && newBulk === 0) newStatus = 'Out of Stock';
        else if (newRetail < 10 || (newRetail + newBulk) <= p.reorderLevel) newStatus = 'Low Stock';

        return {
          ...p,
          bulkStock: newBulk,
          retailStock: newRetail,
          activeStatus: newStatus,
        };
      })
    );

    const newTransfer: StockTransferAudit = {
      id: `trf-${Date.now()}`,
      transferRef: `TRF-${Math.floor(9100 + Math.random() * 899)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      productId: prod.id,
      productName: prod.name,
      quantity,
      sourcePool: 'bulk',
      targetPool: 'retail',
      authorizedBy: currentUser.name,
      reason,
      notes: notes || 'Authorized via MedFlow Dual-Channel Stock Allocation Protocol',
      verified: true,
    };

    setStockTransfers((prev) => [newTransfer, ...prev]);
    return { success: true, message: `Successfully transferred ${quantity} units to retail pool.` };
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'orderDate' | 'status'>): Order => {
    const orderNum = `ORD-${Math.floor(8100 + Math.random() * 899)}`;
    const invNum = `INV-2026-${Math.floor(120 + Math.random() * 899)}`;
    const today = new Date().toISOString().split('T')[0];
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      orderDate: today,
      status: 'Processing',
      invoiceId: invNum,
    };

    // Deduct bulk stock for ordered items
    setProducts((prev) =>
      prev.map((p) => {
        const orderedItem = orderData.items.find((item) => item.productId === p.id);
        if (!orderedItem) return p;
        const newBulk = Math.max(0, p.bulkStock - orderedItem.totalUnits);
        return {
          ...p,
          bulkStock: newBulk,
          activeStatus: (p.retailStock + newBulk) <= p.reorderLevel ? 'Low Stock' : p.activeStatus,
        };
      })
    );

    // Create corresponding Tax Invoice
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invNum,
      orderId: newOrder.id,
      orderNumber: orderNum,
      clientName: newOrder.clientName,
      clientAddress: 'Contracted Pharmacy Bay, Western Cape / Gauteng',
      clientVatNumber: 'ZA491029481',
      issueDate: today,
      dueDate: dueDate.toISOString().split('T')[0],
      grossSubtotal: newOrder.grossSubtotal,
      discountAmount: newOrder.discountAmount,
      netSubtotal: newOrder.netSubtotal,
      vatRate: 0.15,
      vatAmount: newOrder.vatAmount,
      totalAmount: newOrder.totalAmount,
      status: 'Sent',
      daysOverdue: 0,
      items: newOrder.items.map((it) => ({
        description: `${it.productName} (Pack of ${it.packSize} x ${it.packCount})`,
        quantity: it.totalUnits,
        unitPrice: it.unitPrice,
        total: it.netTotal,
      })),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setInvoices((prev) => [newInvoice, ...prev]);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const requestPrescriptionRefill = (prescriptionId: string) => {
    setPrescriptions((prev) =>
      prev.map((rx) => {
        if (rx.id !== prescriptionId) return rx;
        if (rx.refillsRemaining <= 0) return rx;
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + 30);
        return {
          ...rx,
          refillsRemaining: rx.refillsRemaining - 1,
          status: 'Active',
          refillDueDate: nextDate.toISOString().split('T')[0],
        };
      })
    );
    return true;
  };

  const resetAllData = () => {
    setProducts(initialProducts);
    setOrders(initialOrders);
    setInvoices(initialInvoices);
    setPrescriptions(initialPrescriptions);
    setStockTransfers(initialStockTransfers);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchRole,
        products,
        reorderStock,
        transferStock,
        orders,
        createOrder,
        updateOrderStatus,
        invoices,
        prescriptions,
        requestPrescriptionRefill,
        stockTransfers,
        revenueData,
        activeStockPool,
        setActiveStockPool,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
