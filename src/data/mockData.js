/**
 * Comprehensive Mock Data for Rolling Stoned / WorthIT Solutions Integrated System
 */

export const initialCompanyInfo = {
  name: 'Rolling Stoned Natural Health (Pty) Ltd',
  tradingAs: 'Rolling Stoned Natural Health & Clinic Supplies',
  vatNumber: 'ZA4890219482',
  email: 'info@rollingstoned.co.za',
  accountsEmail: 'accounts@rollingstoned.co.za',
  phone: '+27 (0)21 555 0192',
  address: '122 Main Road, Stone Industrial Park, Cape Town, 8001, South Africa',
  developerCredit: {
    name: 'WorthIT Solutions',
    description: 'System Architecture & Software Development Team',
    contact: 'dev@worthit.co.za'
  },
  bankDetails: {
    bank: 'Standard Bank South Africa',
    accountName: 'Rolling Stoned Business Account',
    accountNumber: '0284910482',
    branchCode: '051001',
    swift: 'SBZAJJ'
  }
};

export const initialUsers = [
  {
    id: 'user-admin-1',
    username: 'admin',
    password: 'password123',
    name: 'John Admin',
    email: 'admin@rollingstoned.co.za',
    role: 'admin',
    title: 'System Administrator & Operations Manager',
    avatarInitials: 'JA',
    status: 'active'
  },
  {
    id: 'user-doc-1',
    username: 'dr.naidoo',
    password: 'password123',
    name: 'Dr. Thabo Naidoo',
    email: 't.naidoo@stmarysclinic.org.za',
    role: 'client',
    title: "Chief Medical Officer - St. Mary's Clinic",
    avatarInitials: 'TN',
    clientName: "St. Mary's Clinic",
    status: 'active'
  },
  {
    id: 'user-retail-1',
    username: 'sarah.m',
    password: 'password123',
    name: 'Sarah Meyer',
    email: 'sarah.m@retail.co.za',
    role: 'client',
    title: 'Retail Customer',
    avatarInitials: 'SM',
    clientName: 'Direct Retail Customer',
    status: 'active'
  }
];

export const initialProducts = [
  {
    id: 'PRD-101',
    name: 'Arnica Montana 30C Pellets',
    sku: 'HOM-ARN-030',
    category: 'Homeopathic',
    description: 'Post-trauma pain relief and bruising recovery. Bottle of 80 pellets.',
    unitPriceRetail: 95.00,
    unitPriceBulk: 68.00, // per unit when ordered in boxes of 12
    retailStock: 50,
    bulkStock: 200,
    reorderLevel: 60,
    status: 'In Stock',
    unit: 'Bottle',
    bulkPackaging: 'Box of 12 units'
  },
  {
    id: 'PRD-102',
    name: 'Belladonna 6C Dilution Drops',
    sku: 'HOM-BEL-006',
    category: 'Homeopathic',
    description: 'Acute fever and inflammation support tincture 50ml.',
    unitPriceRetail: 110.00,
    unitPriceBulk: 78.00,
    retailStock: 8,
    bulkStock: 40,
    reorderLevel: 50,
    status: 'Low Stock',
    unit: '50ml Bottle',
    bulkPackaging: 'Box of 12 units'
  },
  {
    id: 'PRD-103',
    name: 'Calendula Natural Healing Ointment 50g',
    sku: 'HOM-CAL-050',
    category: 'Homeopathic',
    description: 'Topical soothing ointment for cuts, abrasions, and skin lesions.',
    unitPriceRetail: 85.00,
    unitPriceBulk: 58.00,
    retailStock: 120,
    bulkStock: 350,
    reorderLevel: 80,
    status: 'In Stock',
    unit: '50g Tube',
    bulkPackaging: 'Box of 24 units'
  },
  {
    id: 'PRD-104',
    name: 'Nux Vomica 30C Pellets',
    sku: 'HOM-NUX-030',
    category: 'Homeopathic',
    description: 'Digestive relief and metabolic support.',
    unitPriceRetail: 95.00,
    unitPriceBulk: 68.00,
    retailStock: 0,
    bulkStock: 15,
    reorderLevel: 40,
    status: 'Out of Stock',
    unit: 'Bottle',
    bulkPackaging: 'Box of 12 units'
  },
  {
    id: 'PRD-201',
    name: 'Waiting Room Ergonomic Chair Set',
    sku: 'FUR-CHR-SET4',
    category: 'Furniture',
    description: 'Antimicrobial healthcare vinyl chairs with lumbar support.',
    unitPriceRetail: 3200.00,
    unitPriceBulk: 2450.00,
    retailStock: 4,
    bulkStock: 18,
    reorderLevel: 8,
    status: 'In Stock',
    unit: 'Set of 4',
    bulkPackaging: 'Pallet of 4 Sets'
  },
  {
    id: 'PRD-202',
    name: 'Hydraulic Examination Treatment Table',
    sku: 'FUR-TBL-HYD',
    category: 'Furniture',
    description: 'Heavy duty height-adjustable multi-section clinic examination table.',
    unitPriceRetail: 8500.00,
    unitPriceBulk: 6900.00,
    retailStock: 2,
    bulkStock: 6,
    reorderLevel: 4,
    status: 'Low Stock',
    unit: 'Unit Bed',
    bulkPackaging: 'Crated Unit'
  },
  {
    id: 'PRD-203',
    name: 'Stainless Medical Utility Cart (3-Tier)',
    sku: 'FUR-CRT-SS3',
    category: 'Furniture',
    description: 'High-grade stainless rolling medical procedure trolley.',
    unitPriceRetail: 1850.00,
    unitPriceBulk: 1400.00,
    retailStock: 12,
    bulkStock: 28,
    reorderLevel: 10,
    status: 'In Stock',
    unit: 'Cart',
    bulkPackaging: 'Flat Pack of 2'
  }
];

export const initialClients = [
  {
    id: 'CLI-01',
    name: "St. Mary's Community Health Clinic",
    contactPerson: 'Dr. Thabo Naidoo',
    email: 't.naidoo@stmarysclinic.org.za',
    phone: '+27 (0)21 448 9200',
    address: '14 Chapel Road, Woodstock, Cape Town',
    vatNumber: 'ZA419082910',
    discountTier: 0.15 // 15% auto bulk discount
  },
  {
    id: 'CLI-02',
    name: 'MedCentre Health Group',
    contactPerson: 'Sr. Eleanor Scott',
    email: 'procurement@medcentre.co.za',
    phone: '+27 (0)11 884 1000',
    address: '88 Sandton Drive, Johannesburg',
    vatNumber: 'ZA491029481',
    discountTier: 0.15
  },
  {
    id: 'CLI-03',
    name: 'Cape Wellness & Integrative Care',
    contactPerson: 'Dr. Megan Jacobs',
    email: 'jacobs@capewellness.co.za',
    phone: '+27 (0)21 789 2200',
    address: '22 Main Road, Claremont, Cape Town',
    vatNumber: 'ZA402910482',
    discountTier: 0.15
  }
];

export const initialOrders = [
  {
    id: 'ORD-8041',
    clientName: "St. Mary's Community Health Clinic",
    clientId: 'CLI-01',
    orderDate: '2026-08-14',
    type: 'Bulk Order',
    items: [
      { productName: 'Arnica Montana 30C Pellets', quantity: 12, unitPrice: 68.00 },
      { productName: 'Calendula Natural Healing Ointment 50g', quantity: 24, unitPrice: 58.00 }
    ],
    subtotal: 2208.00,
    discountAmount: 331.20, // 15% discount
    vatAmount: 281.52, // 15% VAT
    totalAmount: 2158.32,
    status: 'Delivered'
  },
  {
    id: 'ORD-8042',
    clientName: 'MedCentre Health Group',
    clientId: 'CLI-02',
    orderDate: '2026-08-16',
    type: 'Bulk Order',
    items: [
      { productName: 'Waiting Room Ergonomic Chair Set', quantity: 4, unitPrice: 2450.00 },
      { productName: 'Stainless Medical Utility Cart (3-Tier)', quantity: 4, unitPrice: 1400.00 }
    ],
    subtotal: 15400.00,
    discountAmount: 2310.00,
    vatAmount: 1963.50,
    totalAmount: 15053.50,
    status: 'Processing'
  },
  {
    id: 'ORD-8043',
    clientName: 'Cape Wellness & Integrative Care',
    clientId: 'CLI-03',
    orderDate: '2026-08-17',
    type: 'Bulk Order',
    items: [
      { productName: 'Belladonna 6C Dilution Drops', quantity: 12, unitPrice: 78.00 },
      { productName: 'Arnica Montana 30C Pellets', quantity: 24, unitPrice: 68.00 }
    ],
    subtotal: 2568.00,
    discountAmount: 385.20,
    vatAmount: 327.42,
    totalAmount: 2510.22,
    status: 'Pending'
  }
];

export const initialInvoices = [
  {
    id: 'INV-2026-108',
    orderId: 'ORD-8041',
    clientName: "St. Mary's Community Health Clinic",
    clientId: 'CLI-01',
    issueDate: '2026-08-14',
    dueDate: '2026-09-13',
    subtotal: 1876.80,
    vatRate: 0.15,
    vatAmount: 281.52,
    totalAmount: 2158.32,
    status: 'Paid',
    daysOverdue: 0,
    items: [
      { description: 'Arnica Montana 30C (Box of 12)', qty: 1, unitPrice: 816.00, total: 816.00 },
      { description: 'Calendula Ointment 50g (Box of 24)', qty: 1, unitPrice: 1392.00, total: 1392.00 }
    ]
  },
  {
    id: 'INV-2026-109',
    orderId: 'ORD-8042',
    clientName: 'MedCentre Health Group',
    clientId: 'CLI-02',
    issueDate: '2026-08-16',
    dueDate: '2026-09-15',
    subtotal: 13090.00,
    vatRate: 0.15,
    vatAmount: 1963.50,
    totalAmount: 15053.50,
    status: 'Pending',
    daysOverdue: 0,
    items: [
      { description: 'Waiting Room Ergonomic Chair Set (Pallet of 4)', qty: 1, unitPrice: 9800.00, total: 9800.00 },
      { description: 'Stainless Medical Utility Cart (Set of 4)', qty: 1, unitPrice: 5600.00, total: 5600.00 }
    ]
  },
  {
    id: 'INV-2026-092',
    orderId: 'ORD-7910',
    clientName: 'Dr. T. Naidoo Private Practice',
    clientId: 'CLI-01',
    issueDate: '2026-07-01',
    dueDate: '2026-07-31',
    subtotal: 4200.00,
    vatRate: 0.15,
    vatAmount: 630.00,
    totalAmount: 4830.00,
    status: 'Overdue',
    daysOverdue: 17,
    items: [
      { description: 'Homeopathic Dispensary Starter Pack', qty: 2, unitPrice: 2100.00, total: 4200.00 }
    ]
  },
  {
    id: 'INV-2026-088',
    orderId: 'ORD-7845',
    clientName: 'Coastal Wellness Retreat',
    clientId: 'CLI-03',
    issueDate: '2026-06-25',
    dueDate: '2026-07-25',
    subtotal: 6500.00,
    vatRate: 0.15,
    vatAmount: 975.00,
    totalAmount: 7475.00,
    status: 'Overdue',
    daysOverdue: 23,
    items: [
      { description: 'Hydraulic Treatment Table Special Bed', qty: 1, unitPrice: 6500.00, total: 6500.00 }
    ]
  }
];

export const initialRemindersLog = [
  {
    id: 'REM-1',
    invoiceId: 'INV-2026-092',
    clientName: 'Dr. T. Naidoo Private Practice',
    amount: 'R 4,830.00',
    sentDate: '2026-08-15 09:30',
    channel: 'Automated Email',
    status: 'Delivered',
    stage: '14-Day Overdue Notice'
  },
  {
    id: 'REM-2',
    invoiceId: 'INV-2026-088',
    clientName: 'Coastal Wellness Retreat',
    amount: 'R 7,475.00',
    sentDate: '2026-08-16 11:15',
    channel: 'Automated Email + SMS',
    status: 'Delivered',
    stage: '21-Day Final Notice'
  }
];

export const revenueMonthlyData = [
  { month: 'May 2026', retailPercent: 52, bulkPercent: 48, totalGrowth: '+12%', retailRevenue: 48000, bulkRevenue: 44000 },
  { month: 'June 2026', retailPercent: 49, bulkPercent: 51, totalGrowth: '+18%', retailRevenue: 54000, bulkRevenue: 56000 },
  { month: 'July 2026', retailPercent: 47, bulkPercent: 53, totalGrowth: '+28%', retailRevenue: 61000, bulkRevenue: 69000 },
  { month: 'August 2026', retailPercent: 45, bulkPercent: 55, totalGrowth: '+35%', retailRevenue: 68000, bulkRevenue: 83000 },
  { month: 'September 2026 (Est)', retailPercent: 44, bulkPercent: 56, totalGrowth: '+40%', retailRevenue: 72000, bulkRevenue: 91000 },
  { month: 'October 2026 (Target)', retailPercent: 42, bulkPercent: 58, totalGrowth: '+45%', retailRevenue: 78000, bulkRevenue: 107000 }
];
