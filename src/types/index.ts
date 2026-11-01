/**
 * MedFlow Enterprise Domain Types & Interface Definitions
 * Full 7-Role Architecture, 50+ SKU Categories, Prescriber Condition Tagging,
 * Pharmacist Referral Ledger, and Wellness Appointments.
 */

export type UserRole =
  | 'distributor'
  | 'pharmacy'
  | 'patient'
  | 'pharmacist'
  | 'doctor'
  | 'psychiatrist'
  | 'leisure';

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
  hpcsaNumber?: string;
  practiceNumber?: string;
  specialization?: string;
  commissionRate?: number;
}

export type ProductCategory =
  | 'CBD Oils & Extracts'
  | 'Tinctures'
  | 'Capsules & Tablets'
  | 'Topical Balms'
  | 'CBD Edibles'
  | 'Homeopathic Remedies'
  | 'Homeopathic Creams'
  | 'Homeopathic Drops'
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

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

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

export type ConditionTag =
  | 'Anxiety & Panic'
  | 'Chronic Neuropathic Pain'
  | 'Sleep Disorders & Insomnia'
  | 'Arthritic Inflammation'
  | 'Post-Traumatic Stress (PTSD)'
  | 'Digestive Dysbiosis'
  | 'Stress & Autonomic Fatigue';

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  patientName: string;
  prescribingDoctor: string;
  prescriberHpcsa?: string;
  clinicName: string;
  productName: string;
  productId?: string;
  conditionTag?: ConditionTag;
  dosage: string;
  instructions: string;
  prescribedQuantity: number;
  refillsRemaining: number;
  issuedDate: string;
  refillDueDate: string;
  status: 'Active' | 'Refill Due' | 'Completed';
  clinicalOutcomeNotes?: string;
}

export interface PharmacistReferral {
  id: string;
  referralCode: string;
  pharmacistId: string;
  pharmacistName: string;
  pharmacistHpcsa: string;
  patientName: string;
  patientContact: string;
  prescribedTherapy: string;
  orderAmount: number;
  commissionRate: number; // e.g. 0.085 (8.5%)
  commissionEarned: number;
  status: 'Approved' | 'Pending Verification' | 'Settled';
  timestamp: string;
}

export interface WellnessAppointment {
  id: string;
  appointmentRef: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  consultationType:
    | 'CBD Phytocannabinoid Assessment'
    | 'Homeopathic Constitution Intake'
    | 'Stress & Sleep Lifestyle Routine'
    | 'Holistic Pain Recovery Session';
  practitioner: string;
  date: string;
  timeSlot: string;
  status: 'Confirmed' | 'Completed' | 'Rescheduled' | 'Cancelled';
  notes: string;
  wellnessProductRecommendations: string[];
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

export interface PaymentReminderAlert {
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  dueDate: string;
  daysRemaining: number;
  alertTier: 'notice-7d' | 'urgent-3d' | 'final-1d' | 'overdue';
  amount: number;
  badgeLabel: string;
  dispatchedNotice: boolean;
}
