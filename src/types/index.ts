/**
 * MedFlow Enterprise Domain Types & Interface Definitions
 */

export type UserRole = 'distributor' | 'pharmacy' | 'patient';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  organization: string;
  avatarInitials: string;
  vatNumber?: string;
  creditLimit?: number;
  creditUsed?: number;
}

export type ProductCategory = 
  | 'CBD Oils & Extracts'
  | 'Tinctures'
  | 'Capsules & Tablets'
  | 'Topical Balms'
  | 'Bulk Raw Compounds';

export type StockPool = 'retail' | 'bulk';

export interface BulkTierPrice {
  packSize: 12 | 24 | 48;
  unitPrice: number;
  discountPercentage: number;
}

export type ExpiryAlertLevel = 'optimal' | 'warning-30' | 'warning-14' | 'critical-7' | 'expired';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  potency: string; // e.g. "1000mg Full Spectrum", "30C Dilution"
  description: string;
  retailPrice: number;
  bulkTierPrices: BulkTierPrice[];
  retailStock: number;
  bulkStock: number;
  reorderLevel: number;
  expiryDate: string; // YYYY-MM-DD
  batchNumber: string;
  unit: string;
  packagingUnit: string;
  labCertified: boolean;
  activeStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface BulkOrderItem {
  productId: string;
  productName: string;
  sku: string;
  packSize: 12 | 24 | 48;
  packCount: number;
  totalUnits: number;
  unitPrice: number;
  grossTotal: number;
  discountAmount: number;
  netTotal: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered';

export interface Order {
  id: string;
  orderNumber: string;
  clientId: string;
  clientName: string;
  clientType: 'Pharmacy' | 'Clinic' | 'Hospital' | 'Retail';
  orderDate: string;
  items: BulkOrderItem[];
  grossSubtotal: number;
  discountAmount: number;
  netSubtotal: number;
  vatAmount: number; // 15% RSA VAT
  totalAmount: number;
  status: OrderStatus;
  paymentTerms: string;
  invoiceId?: string;
}

export type InvoiceStatus = 'Paid' | 'Sent' | 'Overdue';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  orderNumber: string;
  clientName: string;
  clientAddress: string;
  clientVatNumber: string;
  issueDate: string;
  dueDate: string;
  grossSubtotal: number;
  discountAmount: number;
  netSubtotal: number;
  vatRate: number; // 0.15
  vatAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  daysOverdue: number;
  items: InvoiceItem[];
}

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  patientName: string;
  prescribingDoctor: string;
  clinicName: string;
  productName: string;
  dosage: string;
  instructions: string;
  prescribedQuantity: number;
  refillsRemaining: number;
  issuedDate: string;
  refillDueDate: string;
  status: 'Active' | 'Refill Due' | 'Completed';
}

export interface StockTransferAudit {
  id: string;
  transferRef: string;
  timestamp: string;
  productId: string;
  productName: string;
  quantity: number;
  sourcePool: StockPool;
  targetPool: StockPool;
  authorizedBy: string;
  reason: string;
  notes: string;
  verified: boolean;
}

export interface RevenueDataPoint {
  month: string;
  retailRevenue: number;
  bulkRevenue: number;
  leisureRevenue: number;
  totalGrowth: string;
}

export interface RevenueSegregationSplit {
  channel: 'B2B Bulk Pharmacy' | 'Direct Retail OTC' | 'Leisure & Wellness';
  percentage: number;
  amount: number;
  color: string;
}
