/**
 * Comprehensive Mock Data for Project MedFlow (Licensed CBD & Homeopathic Distributor)
 * 7-Role Architecture, 54 Distinct SKUs, Prescriber Condition Tagging,
 * Pharmacist Referral Ledger, Wellness Appointments, and 7/3/1 Day Payment Reminders.
 */
import {
  Product,
  UserProfile,
  Order,
  Invoice,
  Prescription,
  PharmacistReferral,
  WellnessAppointment,
  PaymentReminderAlert,
  StockTransferAudit,
  RevenueDataPoint,
  RevenueSegregationSplit,
} from '../types';

export const initialUsers: UserProfile[] = [
  {
    "id": "usr-distributor-1",
    "name": "Thomas (Distributor)",
    "email": "thomas@medflowdistribution.co.za",
    "role": "distributor",
    "title": "Managing Director & Operations Head",
    "organization": "MedFlow Natural Health Distribution (Pty) Ltd",
    "avatarInitials": "TM",
    "vatNumber": "ZA4890219482"
  },
  {
    "id": "usr-pharmacy-1",
    "name": "Sr. Eleanor Scott",
    "email": "eleanor.scott@medcentre.co.za",
    "role": "pharmacy",
    "title": "Chief Procurement Pharmacist",
    "organization": "MedCentre Health Group (Sandton)",
    "avatarInitials": "ES",
    "vatNumber": "ZA491029481",
    "creditLimit": 150000,
    "creditUsed": 38400
  },
  {
    "id": "usr-patient-1",
    "name": "Sarah Meyer",
    "email": "sarah.meyer@wellnessmail.co.za",
    "role": "patient",
    "title": "Registered Chronic Patient",
    "organization": "Direct Patient Healthcare Program",
    "avatarInitials": "SM"
  },
  {
    "id": "usr-pharmacist-1",
    "name": "Tariq Moodley (Pharmacist)",
    "email": "tariq.moodley@medflowdispensary.co.za",
    "role": "pharmacist",
    "title": "Lead Clinical Dispensing Pharmacist",
    "organization": "St. Marys Hospital Dispensary",
    "avatarInitials": "TM",
    "hpcsaNumber": "PH0284711",
    "commissionRate": 0.085
  },
  {
    "id": "usr-doctor-1",
    "name": "Dr. Hendrik van der Merwe",
    "email": "dr.hendrik@capewellness.co.za",
    "role": "doctor",
    "title": "Specialist Integrative Physician (GP)",
    "organization": "Cape Integrative Family Practice",
    "avatarInitials": "HV",
    "hpcsaNumber": "MP0482910",
    "practiceNumber": "PR0941824",
    "specialization": "Cannabinoid Medicine & Chronic Pain"
  },
  {
    "id": "usr-psychiatrist-1",
    "name": "Dr. Thandiwe Khumalo",
    "email": "dr.thandiwe@neurocare.co.za",
    "role": "psychiatrist",
    "title": "Consultant Neuro-Psychiatrist",
    "organization": "Gauteng Neuro-Psychiatric Institute",
    "avatarInitials": "TK",
    "hpcsaNumber": "MP0821944",
    "practiceNumber": "PR0712948",
    "specialization": "Neuropsychiatry, Anxiety & Sleep Disorders"
  },
  {
    "id": "usr-leisure-1",
    "name": "Chloe Du Plessis",
    "email": "chloe.dp@lifestylehealth.co.za",
    "role": "leisure",
    "title": "Wellness & Lifestyle Client",
    "organization": "Camps Bay Wellness & Spa Circle",
    "avatarInitials": "CD"
  }
];

export const initialProducts: Product[] = [
  {
    "id": "PRD-MED-001",
    "name": "Full Spectrum CBD Oil 1000mg 30ml",
    "sku": "CBD-FS-1000",
    "category": "CBD Oils & Extracts",
    "potency": "1000mg Full Spectrum",
    "description": "Pharmaceutical grade Full Spectrum CBD Oil 1000mg 30ml distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 650,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 585,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 553,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 488,
        "discountPercentage": 25
      }
    ],
    "retailStock": 45,
    "bulkStock": 320,
    "reorderLevel": 40,
    "expiryDate": "2028-04-15",
    "batchNumber": "BAT-2026-101",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-002",
    "name": "Full Spectrum CBD Oil 500mg 30ml",
    "sku": "CBD-FS-0500",
    "category": "CBD Oils & Extracts",
    "potency": "500mg Full Spectrum",
    "description": "Pharmaceutical grade Full Spectrum CBD Oil 500mg 30ml distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 420,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 378,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 357,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 315,
        "discountPercentage": 25
      }
    ],
    "retailStock": 60,
    "bulkStock": 400,
    "reorderLevel": 50,
    "expiryDate": "2028-05-20",
    "batchNumber": "BAT-2026-102",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-003",
    "name": "Full Spectrum CBD Oil 1500mg 30ml",
    "sku": "CBD-FS-1500",
    "category": "CBD Oils & Extracts",
    "potency": "1500mg Full Spectrum",
    "description": "Pharmaceutical grade Full Spectrum CBD Oil 1500mg 30ml distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 890,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 801,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 757,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 668,
        "discountPercentage": 25
      }
    ],
    "retailStock": 30,
    "bulkStock": 240,
    "reorderLevel": 30,
    "expiryDate": "2028-06-10",
    "batchNumber": "BAT-2026-103",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-004",
    "name": "Full Spectrum CBD Oil 3000mg Max Strength 50ml",
    "sku": "CBD-FS-3000",
    "category": "CBD Oils & Extracts",
    "potency": "3000mg High Potency",
    "description": "Pharmaceutical grade Full Spectrum CBD Oil 3000mg Max Strength 50ml distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 1450,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 1305,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 1233,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 1088,
        "discountPercentage": 25
      }
    ],
    "retailStock": 15,
    "bulkStock": 120,
    "reorderLevel": 20,
    "expiryDate": "2028-08-30",
    "batchNumber": "BAT-2026-104",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-005",
    "name": "Broad Spectrum CBD Oil 500mg (THC-Free) 30ml",
    "sku": "CBD-BS-0500",
    "category": "CBD Oils & Extracts",
    "potency": "500mg Broad Spectrum",
    "description": "Pharmaceutical grade Broad Spectrum CBD Oil 500mg (THC-Free) 30ml distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 450,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 405,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 383,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 338,
        "discountPercentage": 25
      }
    ],
    "retailStock": 35,
    "bulkStock": 280,
    "reorderLevel": 30,
    "expiryDate": "2028-03-12",
    "batchNumber": "BAT-2026-105",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-006",
    "name": "Broad Spectrum CBD Oil 1000mg (THC-Free) 30ml",
    "sku": "CBD-BS-1000",
    "category": "CBD Oils & Extracts",
    "potency": "1000mg Broad Spectrum",
    "description": "Pharmaceutical grade Broad Spectrum CBD Oil 1000mg (THC-Free) 30ml distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 690,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 621,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 587,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 518,
        "discountPercentage": 25
      }
    ],
    "retailStock": 28,
    "bulkStock": 210,
    "reorderLevel": 25,
    "expiryDate": "2028-07-14",
    "batchNumber": "BAT-2026-106",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-007",
    "name": "CBD Night Drops with CBN & Chamomile 30ml",
    "sku": "CBD-SLP-0750",
    "category": "CBD Oils & Extracts",
    "potency": "750mg CBD + 150mg CBN",
    "description": "Pharmaceutical grade CBD Night Drops with CBN & Chamomile 30ml distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 720,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 648,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 612,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 540,
        "discountPercentage": 25
      }
    ],
    "retailStock": 20,
    "bulkStock": 160,
    "reorderLevel": 25,
    "expiryDate": "2027-11-20",
    "batchNumber": "BAT-2026-107",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-008",
    "name": "CBD Focus Elixir with CBG & Rosemary 30ml",
    "sku": "CBD-FOC-0600",
    "category": "CBD Oils & Extracts",
    "potency": "600mg CBD + 200mg CBG",
    "description": "Pharmaceutical grade CBD Focus Elixir with CBG & Rosemary 30ml distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 680,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 612,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 578,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 510,
        "discountPercentage": 25
      }
    ],
    "retailStock": 22,
    "bulkStock": 140,
    "reorderLevel": 20,
    "expiryDate": "2028-01-18",
    "batchNumber": "BAT-2026-108",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-009",
    "name": "Pure CBD Isolate Drops 1000mg 30ml",
    "sku": "CBD-ISO-1000",
    "category": "CBD Oils & Extracts",
    "potency": "1000mg 99.8% Pure CBD",
    "description": "Pharmaceutical grade Pure CBD Isolate Drops 1000mg 30ml distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 580,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 522,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 493,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 435,
        "discountPercentage": 25
      }
    ],
    "retailStock": 40,
    "bulkStock": 260,
    "reorderLevel": 35,
    "expiryDate": "2028-09-05",
    "batchNumber": "BAT-2026-109",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-010",
    "name": "CBD Pediatric Micro-Dose Elixir 250mg 30ml",
    "sku": "CBD-PED-0250",
    "category": "CBD Oils & Extracts",
    "potency": "250mg Gentle Formula",
    "description": "Pharmaceutical grade CBD Pediatric Micro-Dose Elixir 250mg 30ml distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 340,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 306,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 289,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 255,
        "discountPercentage": 25
      }
    ],
    "retailStock": 18,
    "bulkStock": 110,
    "reorderLevel": 15,
    "expiryDate": "2028-02-28",
    "batchNumber": "BAT-2026-110",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-011",
    "name": "CBD Softgels 25mg (30 Capsules)",
    "sku": "CBD-CAP-025",
    "category": "Capsules & Tablets",
    "potency": "25mg / Softgel",
    "description": "Pharmaceutical grade CBD Softgels 25mg (30 Capsules) distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 490,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 441,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 417,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 368,
        "discountPercentage": 25
      }
    ],
    "retailStock": 40,
    "bulkStock": 280,
    "reorderLevel": 35,
    "expiryDate": "2028-06-30",
    "batchNumber": "BAT-2026-111",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-012",
    "name": "CBD Softgels 50mg Ultra (30 Capsules)",
    "sku": "CBD-CAP-050",
    "category": "Capsules & Tablets",
    "potency": "50mg / Softgel",
    "description": "Pharmaceutical grade CBD Softgels 50mg Ultra (30 Capsules) distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 820,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 738,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 697,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 615,
        "discountPercentage": 25
      }
    ],
    "retailStock": 25,
    "bulkStock": 190,
    "reorderLevel": 25,
    "expiryDate": "2028-08-15",
    "batchNumber": "BAT-2026-112",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-013",
    "name": "CBD Daily Wellness Micro-Caps 10mg (60s)",
    "sku": "CBD-CAP-010",
    "category": "Capsules & Tablets",
    "potency": "10mg / Capsule",
    "description": "Pharmaceutical grade CBD Daily Wellness Micro-Caps 10mg (60s) distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 390,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 351,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 332,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 293,
        "discountPercentage": 25
      }
    ],
    "retailStock": 50,
    "bulkStock": 310,
    "reorderLevel": 40,
    "expiryDate": "2028-05-10",
    "batchNumber": "BAT-2026-113",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-014",
    "name": "CBD Sleep PM Softgels with Melatonin (30s)",
    "sku": "CBD-CAP-SLP",
    "category": "Capsules & Tablets",
    "potency": "25mg CBD + 3mg Melatonin",
    "description": "Pharmaceutical grade CBD Sleep PM Softgels with Melatonin (30s) distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 560,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 504,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 476,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 420,
        "discountPercentage": 25
      }
    ],
    "retailStock": 30,
    "bulkStock": 210,
    "reorderLevel": 30,
    "expiryDate": "2027-12-05",
    "batchNumber": "BAT-2026-114",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-015",
    "name": "CBD Joint Mobility Complex Capsules (60s)",
    "sku": "CBD-CAP-JNT",
    "category": "Capsules & Tablets",
    "potency": "20mg CBD + Glucosamine",
    "description": "Pharmaceutical grade CBD Joint Mobility Complex Capsules (60s) distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 580,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 522,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 493,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 435,
        "discountPercentage": 25
      }
    ],
    "retailStock": 28,
    "bulkStock": 180,
    "reorderLevel": 25,
    "expiryDate": "2028-04-12",
    "batchNumber": "BAT-2026-115",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-016",
    "name": "CBD Neuro-Calm Tablets with L-Theanine (30s)",
    "sku": "CBD-TAB-CLM",
    "category": "Capsules & Tablets",
    "potency": "25mg CBD + 100mg L-Theanine",
    "description": "Pharmaceutical grade CBD Neuro-Calm Tablets with L-Theanine (30s) distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 520,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 468,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 442,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 390,
        "discountPercentage": 25
      }
    ],
    "retailStock": 32,
    "bulkStock": 230,
    "reorderLevel": 30,
    "expiryDate": "2028-03-25",
    "batchNumber": "BAT-2026-116",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-017",
    "name": "CBD Fast-Melt Sublingual Tablets 15mg (30s)",
    "sku": "CBD-TAB-SUB",
    "category": "Capsules & Tablets",
    "potency": "15mg Nano-Emulsified",
    "description": "Pharmaceutical grade CBD Fast-Melt Sublingual Tablets 15mg (30s) distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 440,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 396,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 374,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 330,
        "discountPercentage": 25
      }
    ],
    "retailStock": 24,
    "bulkStock": 170,
    "reorderLevel": 20,
    "expiryDate": "2028-07-10",
    "batchNumber": "BAT-2026-117",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-018",
    "name": "CBD Digestive Probiotic Capsules (30s)",
    "sku": "CBD-CAP-PRO",
    "category": "Capsules & Tablets",
    "potency": "15mg CBD + 10B CFU Probiotic",
    "description": "Pharmaceutical grade CBD Digestive Probiotic Capsules (30s) distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 540,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 486,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 459,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 405,
        "discountPercentage": 25
      }
    ],
    "retailStock": 20,
    "bulkStock": 150,
    "reorderLevel": 20,
    "expiryDate": "2028-02-14",
    "batchNumber": "BAT-2026-118",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-019",
    "name": "CBD Cryo-Cooling Muscle Relief Balm 100ml",
    "sku": "TOP-CAL-100",
    "category": "Topical Balms",
    "potency": "1000mg CBD + Menthol & Camphor",
    "description": "Pharmaceutical grade CBD Cryo-Cooling Muscle Relief Balm 100ml distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 380,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 342,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 323,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 285,
        "discountPercentage": 25
      }
    ],
    "retailStock": 35,
    "bulkStock": 250,
    "reorderLevel": 30,
    "expiryDate": "2028-07-22",
    "batchNumber": "BAT-2026-119",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-020",
    "name": "CBD Deep Thermal Warming Rub 100ml",
    "sku": "TOP-WRM-100",
    "category": "Topical Balms",
    "potency": "750mg CBD + Capsaicin",
    "description": "Pharmaceutical grade CBD Deep Thermal Warming Rub 100ml distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 395,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 356,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 336,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 296,
        "discountPercentage": 25
      }
    ],
    "retailStock": 28,
    "bulkStock": 190,
    "reorderLevel": 25,
    "expiryDate": "2028-06-18",
    "batchNumber": "BAT-2026-120",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-021",
    "name": "CBD Intensive Wound & Scar Salve 50ml",
    "sku": "TOP-SCV-050",
    "category": "Topical Balms",
    "potency": "500mg CBD + Calendula & Honey",
    "description": "Pharmaceutical grade CBD Intensive Wound & Scar Salve 50ml distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 320,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 288,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 272,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 240,
        "discountPercentage": 25
      }
    ],
    "retailStock": 30,
    "bulkStock": 210,
    "reorderLevel": 25,
    "expiryDate": "2028-08-05",
    "batchNumber": "BAT-2026-121",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-022",
    "name": "CBD Roll-On Tension Applicator 10ml",
    "sku": "TOP-ROL-010",
    "category": "Topical Balms",
    "potency": "250mg CBD + Peppermint Oil",
    "description": "Pharmaceutical grade CBD Roll-On Tension Applicator 10ml distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 190,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 171,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 162,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 143,
        "discountPercentage": 25
      }
    ],
    "retailStock": 65,
    "bulkStock": 450,
    "reorderLevel": 50,
    "expiryDate": "2028-10-12",
    "batchNumber": "BAT-2026-122",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-023",
    "name": "CBD Eczema & Psoriasis Calming Cream 120ml",
    "sku": "TOP-DERM-120",
    "category": "Topical Balms",
    "potency": "800mg CBD + Colloidal Oat",
    "description": "Pharmaceutical grade CBD Eczema & Psoriasis Calming Cream 120ml distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 460,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 414,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 391,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 345,
        "discountPercentage": 25
      }
    ],
    "retailStock": 22,
    "bulkStock": 160,
    "reorderLevel": 20,
    "expiryDate": "2028-04-30",
    "batchNumber": "BAT-2026-123",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-024",
    "name": "CBD Anti-Aging Peptide Facial Serum 30ml",
    "sku": "TOP-FC-030",
    "category": "Topical Balms",
    "potency": "400mg CBD + Hyaluronic Acid",
    "description": "Pharmaceutical grade CBD Anti-Aging Peptide Facial Serum 30ml distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 580,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 522,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 493,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 435,
        "discountPercentage": 25
      }
    ],
    "retailStock": 18,
    "bulkStock": 130,
    "reorderLevel": 15,
    "expiryDate": "2028-05-15",
    "batchNumber": "BAT-2026-124",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-025",
    "name": "CBD Transdermal Pain Patch (Pack of 5)",
    "sku": "TOP-PAT-005",
    "category": "Topical Balms",
    "potency": "50mg Slow-Release per Patch",
    "description": "Pharmaceutical grade CBD Transdermal Pain Patch (Pack of 5) distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 350,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 315,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 298,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 263,
        "discountPercentage": 25
      }
    ],
    "retailStock": 45,
    "bulkStock": 320,
    "reorderLevel": 40,
    "expiryDate": "2028-09-15",
    "batchNumber": "BAT-2026-125",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-026",
    "name": "CBD Therapeutic Massage Emulsion 250ml",
    "sku": "TOP-MSG-250",
    "category": "Topical Balms",
    "potency": "1200mg CBD + Jojoba Oil",
    "description": "Pharmaceutical grade CBD Therapeutic Massage Emulsion 250ml distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 620,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 558,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 527,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 465,
        "discountPercentage": 25
      }
    ],
    "retailStock": 15,
    "bulkStock": 110,
    "reorderLevel": 15,
    "expiryDate": "2028-03-08",
    "batchNumber": "BAT-2026-126",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-027",
    "name": "CBD Infused Citrus Vegan Gummies 25mg (30s)",
    "sku": "EDB-GUM-025",
    "category": "CBD Edibles",
    "potency": "25mg / Gummy (750mg Total)",
    "description": "Pharmaceutical grade CBD Infused Citrus Vegan Gummies 25mg (30s) distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 360,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 324,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 306,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 270,
        "discountPercentage": 25
      }
    ],
    "retailStock": 50,
    "bulkStock": 340,
    "reorderLevel": 45,
    "expiryDate": "2027-10-15",
    "batchNumber": "BAT-2026-127",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-028",
    "name": "CBD Berry Relaxation Sleep Chews 20mg (30s)",
    "sku": "EDB-GUM-SLP",
    "category": "CBD Edibles",
    "potency": "20mg CBD + 5mg Melatonin",
    "description": "Pharmaceutical grade CBD Berry Relaxation Sleep Chews 20mg (30s) distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 380,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 342,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 323,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 285,
        "discountPercentage": 25
      }
    ],
    "retailStock": 42,
    "bulkStock": 290,
    "reorderLevel": 35,
    "expiryDate": "2027-11-05",
    "batchNumber": "BAT-2026-128",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-029",
    "name": "CBD Sugar-Free Focus Pastilles (30 Lozenges)",
    "sku": "EDB-PAS-015",
    "category": "CBD Edibles",
    "potency": "15mg CBD + Zinc",
    "description": "Pharmaceutical grade CBD Sugar-Free Focus Pastilles (30 Lozenges) distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 280,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 252,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 238,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 210,
        "discountPercentage": 25
      }
    ],
    "retailStock": 55,
    "bulkStock": 380,
    "reorderLevel": 40,
    "expiryDate": "2027-12-18",
    "batchNumber": "BAT-2026-129",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-030",
    "name": "CBD Artisanal Dark Chocolate 70% (80g)",
    "sku": "EDB-CHO-080",
    "category": "CBD Edibles",
    "potency": "100mg Full Spectrum per Bar",
    "description": "Pharmaceutical grade CBD Artisanal Dark Chocolate 70% (80g) distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 160,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 144,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 136,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 120,
        "discountPercentage": 25
      }
    ],
    "retailStock": 70,
    "bulkStock": 420,
    "reorderLevel": 60,
    "expiryDate": "2027-09-25",
    "batchNumber": "BAT-2026-130",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-031",
    "name": "CBD Honey Infusion Organic 250g Jar",
    "sku": "EDB-HNY-250",
    "category": "CBD Edibles",
    "potency": "500mg Raw Honey Infusion",
    "description": "Pharmaceutical grade CBD Honey Infusion Organic 250g Jar distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 340,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 306,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 289,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 255,
        "discountPercentage": 25
      }
    ],
    "retailStock": 25,
    "bulkStock": 170,
    "reorderLevel": 20,
    "expiryDate": "2028-11-10",
    "batchNumber": "BAT-2026-131",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-032",
    "name": "CBD Sparkling Botanical Wellness Tonic (Pack of 6)",
    "sku": "EDB-BEV-006",
    "category": "CBD Edibles",
    "potency": "15mg Nano-CBD per 330ml Can",
    "description": "Pharmaceutical grade CBD Sparkling Botanical Wellness Tonic (Pack of 6) distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 240,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 216,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 204,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 180,
        "discountPercentage": 25
      }
    ],
    "retailStock": 30,
    "bulkStock": 210,
    "reorderLevel": 25,
    "expiryDate": "2027-08-30",
    "batchNumber": "BAT-2026-132",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-033",
    "name": "Full Spectrum High-Terpene Tincture 60ml",
    "sku": "TIN-FST-060",
    "category": "Tinctures",
    "potency": "1200mg Terpene Enhanced",
    "description": "Pharmaceutical grade Full Spectrum High-Terpene Tincture 60ml distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 740,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 666,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 629,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 555,
        "discountPercentage": 25
      }
    ],
    "retailStock": 25,
    "bulkStock": 170,
    "reorderLevel": 20,
    "expiryDate": "2028-06-15",
    "batchNumber": "BAT-2026-133",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-034",
    "name": "Water-Soluble Nano-CBD Oral Tincture 30ml",
    "sku": "TIN-NNO-030",
    "category": "Tinctures",
    "potency": "500mg Fast-Absorption Nano",
    "description": "Pharmaceutical grade Water-Soluble Nano-CBD Oral Tincture 30ml distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 590,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 531,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 502,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 443,
        "discountPercentage": 25
      }
    ],
    "retailStock": 30,
    "bulkStock": 220,
    "reorderLevel": 25,
    "expiryDate": "2028-05-22",
    "batchNumber": "BAT-2026-134",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-035",
    "name": "CBD & CBG Synergistic Tincture 1:1 30ml",
    "sku": "TIN-SYN-030",
    "category": "Tinctures",
    "potency": "500mg CBD + 500mg CBG",
    "description": "Pharmaceutical grade CBD & CBG Synergistic Tincture 1:1 30ml distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 780,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 702,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 663,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 585,
        "discountPercentage": 25
      }
    ],
    "retailStock": 20,
    "bulkStock": 140,
    "reorderLevel": 18,
    "expiryDate": "2028-07-04",
    "batchNumber": "BAT-2026-135",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-036",
    "name": "CBD & CBN Sleep Restorative Tincture 50ml",
    "sku": "TIN-CBN-050",
    "category": "Tinctures",
    "potency": "1000mg CBD + 300mg CBN",
    "description": "Pharmaceutical grade CBD & CBN Sleep Restorative Tincture 50ml distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 920,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 828,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 782,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 690,
        "discountPercentage": 25
      }
    ],
    "retailStock": 18,
    "bulkStock": 120,
    "reorderLevel": 15,
    "expiryDate": "2028-04-18",
    "batchNumber": "BAT-2026-136",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-037",
    "name": "Therapeutic High-Linalool Anxiety Tincture 30ml",
    "sku": "TIN-LIN-030",
    "category": "Tinctures",
    "potency": "800mg with Lavender Terpenes",
    "description": "Pharmaceutical grade Therapeutic High-Linalool Anxiety Tincture 30ml distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 630,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 567,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 536,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 473,
        "discountPercentage": 25
      }
    ],
    "retailStock": 22,
    "bulkStock": 150,
    "reorderLevel": 20,
    "expiryDate": "2028-03-14",
    "batchNumber": "BAT-2026-137",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-038",
    "name": "Veterinary Companion CBD Tincture 250mg 30ml",
    "sku": "TIN-VET-030",
    "category": "Tinctures",
    "potency": "250mg Pet-Safe Bacon Infused",
    "description": "Pharmaceutical grade Veterinary Companion CBD Tincture 250mg 30ml distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 310,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 279,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 264,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 233,
        "discountPercentage": 25
      }
    ],
    "retailStock": 40,
    "bulkStock": 270,
    "reorderLevel": 30,
    "expiryDate": "2028-08-11",
    "batchNumber": "BAT-2026-138",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-039",
    "name": "Arnica Montana 30C Pellets (80 Doses)",
    "sku": "HOM-ARN-030",
    "category": "Homeopathic Remedies",
    "potency": "30C Dilution",
    "description": "Pharmaceutical grade Arnica Montana 30C Pellets (80 Doses) distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 185,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 167,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 157,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 139,
        "discountPercentage": 25
      }
    ],
    "retailStock": 55,
    "bulkStock": 420,
    "reorderLevel": 45,
    "expiryDate": "2028-10-31",
    "batchNumber": "BAT-2026-139",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-040",
    "name": "Arnica Montana 200C High Dilution (80 Doses)",
    "sku": "HOM-ARN-200",
    "category": "Homeopathic Remedies",
    "potency": "200C Acute Trauma",
    "description": "Pharmaceutical grade Arnica Montana 200C High Dilution (80 Doses) distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 215,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 194,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 183,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 161,
        "discountPercentage": 25
      }
    ],
    "retailStock": 40,
    "bulkStock": 310,
    "reorderLevel": 35,
    "expiryDate": "2028-11-15",
    "batchNumber": "BAT-2026-140",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-041",
    "name": "Nux Vomica 30C Digestive Balance (80 Doses)",
    "sku": "HOM-NUX-030",
    "category": "Homeopathic Remedies",
    "potency": "30C Dilution",
    "description": "Pharmaceutical grade Nux Vomica 30C Digestive Balance (80 Doses) distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 175,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 158,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 149,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 131,
        "discountPercentage": 25
      }
    ],
    "retailStock": 48,
    "bulkStock": 360,
    "reorderLevel": 40,
    "expiryDate": "2028-08-20",
    "batchNumber": "BAT-2026-141",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-042",
    "name": "Belladonna 30C Acute Inflammatory Relief (80s)",
    "sku": "HOM-BEL-030",
    "category": "Homeopathic Remedies",
    "potency": "30C Dilution",
    "description": "Pharmaceutical grade Belladonna 30C Acute Inflammatory Relief (80s) distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 180,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 162,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 153,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 135,
        "discountPercentage": 25
      }
    ],
    "retailStock": 38,
    "bulkStock": 290,
    "reorderLevel": 30,
    "expiryDate": "2028-07-28",
    "batchNumber": "BAT-2026-142",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-043",
    "name": "Hypericum Perforatum 30C Nerve Support (80s)",
    "sku": "HOM-HYP-030",
    "category": "Homeopathic Remedies",
    "potency": "30C Nerve Injury Care",
    "description": "Pharmaceutical grade Hypericum Perforatum 30C Nerve Support (80s) distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 195,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 176,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 166,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 146,
        "discountPercentage": 25
      }
    ],
    "retailStock": 35,
    "bulkStock": 260,
    "reorderLevel": 30,
    "expiryDate": "2028-09-12",
    "batchNumber": "BAT-2026-143",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-044",
    "name": "Rhus Toxicodendron 30C Joint & Stiffness (80s)",
    "sku": "HOM-RHU-030",
    "category": "Homeopathic Remedies",
    "potency": "30C Mobility Remedy",
    "description": "Pharmaceutical grade Rhus Toxicodendron 30C Joint & Stiffness (80s) distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 180,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 162,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 153,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 135,
        "discountPercentage": 25
      }
    ],
    "retailStock": 42,
    "bulkStock": 320,
    "reorderLevel": 35,
    "expiryDate": "2028-06-19",
    "batchNumber": "BAT-2026-144",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-045",
    "name": "Aconitum Napellus 30C Shock & Anxiety (80s)",
    "sku": "HOM-ACO-030",
    "category": "Homeopathic Remedies",
    "potency": "30C Acute Panic Formula",
    "description": "Pharmaceutical grade Aconitum Napellus 30C Shock & Anxiety (80s) distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 185,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 167,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 157,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 139,
        "discountPercentage": 25
      }
    ],
    "retailStock": 30,
    "bulkStock": 240,
    "reorderLevel": 25,
    "expiryDate": "2028-05-30",
    "batchNumber": "BAT-2026-145",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-046",
    "name": "Gelsemium Sempervirens 30C Anticipatory Stress (80s)",
    "sku": "HOM-GEL-030",
    "category": "Homeopathic Remedies",
    "potency": "30C Calming Doses",
    "description": "Pharmaceutical grade Gelsemium Sempervirens 30C Anticipatory Stress (80s) distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 190,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 171,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 162,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 143,
        "discountPercentage": 25
      }
    ],
    "retailStock": 28,
    "bulkStock": 220,
    "reorderLevel": 25,
    "expiryDate": "2028-08-14",
    "batchNumber": "BAT-2026-146",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-047",
    "name": "Arnica Montana Bruise & Sprain Cream 100g",
    "sku": "HOM-CRM-ARN",
    "category": "Homeopathic Creams",
    "potency": "10% Mother Tincture Base",
    "description": "Pharmaceutical grade Arnica Montana Bruise & Sprain Cream 100g distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 195,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 176,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 166,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 146,
        "discountPercentage": 25
      }
    ],
    "retailStock": 45,
    "bulkStock": 350,
    "reorderLevel": 40,
    "expiryDate": "2028-04-18",
    "batchNumber": "BAT-2026-147",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-048",
    "name": "Calendula Officinalis Healing Ointment 100g",
    "sku": "HOM-CRM-CAL",
    "category": "Homeopathic Creams",
    "potency": "Antiseptic Herbal Compound",
    "description": "Pharmaceutical grade Calendula Officinalis Healing Ointment 100g distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 185,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 167,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 157,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 139,
        "discountPercentage": 25
      }
    ],
    "retailStock": 50,
    "bulkStock": 380,
    "reorderLevel": 40,
    "expiryDate": "2028-07-09",
    "batchNumber": "BAT-2026-148",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-049",
    "name": "Rescue Trauma Salve Complex 75g",
    "sku": "HOM-CRM-RSC",
    "category": "Homeopathic Creams",
    "potency": "Multi-Remedy Synergy Cream",
    "description": "Pharmaceutical grade Rescue Trauma Salve Complex 75g distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 230,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 207,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 196,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 173,
        "discountPercentage": 25
      }
    ],
    "retailStock": 35,
    "bulkStock": 270,
    "reorderLevel": 30,
    "expiryDate": "2028-09-22",
    "batchNumber": "BAT-2026-149",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-050",
    "name": "Thuja Occidentalis Skin Restoration Cream 50g",
    "sku": "HOM-CRM-THU",
    "category": "Homeopathic Creams",
    "potency": "Dermal Regenerative Formula",
    "description": "Pharmaceutical grade Thuja Occidentalis Skin Restoration Cream 50g distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 210,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 189,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 179,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 158,
        "discountPercentage": 25
      }
    ],
    "retailStock": 25,
    "bulkStock": 190,
    "reorderLevel": 20,
    "expiryDate": "2028-06-11",
    "batchNumber": "BAT-2026-150",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-051",
    "name": "Symphytum Bone & Tendon Soothing Rub 100g",
    "sku": "HOM-CRM-SYM",
    "category": "Homeopathic Creams",
    "potency": "Comfrey Mother Tincture 8%",
    "description": "Pharmaceutical grade Symphytum Bone & Tendon Soothing Rub 100g distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 225,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 203,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 191,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 169,
        "discountPercentage": 25
      }
    ],
    "retailStock": 30,
    "bulkStock": 230,
    "reorderLevel": 25,
    "expiryDate": "2028-08-25",
    "batchNumber": "BAT-2026-151",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-052",
    "name": "Anxiety & Nervous Tension Complex Drops 50ml",
    "sku": "HOM-DRP-ANX",
    "category": "Homeopathic Drops",
    "potency": "Ignatia, Passiflora & Aconite",
    "description": "Pharmaceutical grade Anxiety & Nervous Tension Complex Drops 50ml distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 240,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 216,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 204,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 180,
        "discountPercentage": 25
      }
    ],
    "retailStock": 40,
    "bulkStock": 310,
    "reorderLevel": 35,
    "expiryDate": "2028-05-14",
    "batchNumber": "BAT-2026-152",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-053",
    "name": "Insomnia & Restful Night Complex Drops 50ml",
    "sku": "HOM-DRP-SLP",
    "category": "Homeopathic Drops",
    "potency": "Coffea Cruda & Valeriana 6X",
    "description": "Pharmaceutical grade Insomnia & Restful Night Complex Drops 50ml distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 250,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 225,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 213,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 188,
        "discountPercentage": 25
      }
    ],
    "retailStock": 45,
    "bulkStock": 340,
    "reorderLevel": 35,
    "expiryDate": "2028-08-20",
    "batchNumber": "BAT-2026-153",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-054",
    "name": "Chronic Fatigue & Adrenal Tonic Drops 50ml",
    "sku": "HOM-DRP-ADR",
    "category": "Homeopathic Drops",
    "potency": "Phosphoric Acid & Ginseng 6C",
    "description": "Pharmaceutical grade Chronic Fatigue & Adrenal Tonic Drops 50ml distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 260,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 234,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 221,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 195,
        "discountPercentage": 25
      }
    ],
    "retailStock": 32,
    "bulkStock": 240,
    "reorderLevel": 25,
    "expiryDate": "2028-06-30",
    "batchNumber": "BAT-2026-154",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-055",
    "name": "Sinus & Respiratory Allergy Relief Drops 50ml",
    "sku": "HOM-DRP-SIN",
    "category": "Homeopathic Drops",
    "potency": "Allium Cepa & Euphrasia 30C",
    "description": "Pharmaceutical grade Sinus & Respiratory Allergy Relief Drops 50ml distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 220,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 198,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 187,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 165,
        "discountPercentage": 25
      }
    ],
    "retailStock": 38,
    "bulkStock": 280,
    "reorderLevel": 30,
    "expiryDate": "2028-04-05",
    "batchNumber": "BAT-2026-155",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-056",
    "name": "Digestive Spasm & Dyspepsia Drops 50ml",
    "sku": "HOM-DRP-DIG",
    "category": "Homeopathic Drops",
    "potency": "Carbo Veg & Lycopodium 30C",
    "description": "Pharmaceutical grade Digestive Spasm & Dyspepsia Drops 50ml distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 230,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 207,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 196,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 173,
        "discountPercentage": 25
      }
    ],
    "retailStock": 35,
    "bulkStock": 260,
    "reorderLevel": 30,
    "expiryDate": "2028-07-16",
    "batchNumber": "BAT-2026-156",
    "unit": "Unit",
    "packagingUnit": "Boxed Bottle",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-057",
    "name": "Pure CBD Isolate 99.8% Powder (1kg Drum)",
    "sku": "BLK-ISO-1KG",
    "category": "Bulk Raw Compounds",
    "potency": "99.8% Pharma Grade",
    "description": "Pharmaceutical grade Pure CBD Isolate 99.8% Powder (1kg Drum) distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 42000,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 37800,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 35700,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 31500,
        "discountPercentage": 25
      }
    ],
    "retailStock": 2,
    "bulkStock": 18,
    "reorderLevel": 5,
    "expiryDate": "2029-01-30",
    "batchNumber": "BAT-2026-157",
    "unit": "Unit",
    "packagingUnit": "Container",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-058",
    "name": "Full Spectrum CBD Distillate 85% (1kg Container)",
    "sku": "BLK-DST-1KG",
    "category": "Bulk Raw Compounds",
    "potency": "85% Active Cannabinoids",
    "description": "Pharmaceutical grade Full Spectrum CBD Distillate 85% (1kg Container) distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 38500,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 34650,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 32725,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 28875,
        "discountPercentage": 25
      }
    ],
    "retailStock": 3,
    "bulkStock": 15,
    "reorderLevel": 4,
    "expiryDate": "2028-12-15",
    "batchNumber": "BAT-2026-158",
    "unit": "Unit",
    "packagingUnit": "Container",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-059",
    "name": "Organic Mother Tincture Base Alcohol 96% (5 Litres)",
    "sku": "BLK-ALC-005",
    "category": "Bulk Raw Compounds",
    "potency": "96% BP Extraction Alcohol",
    "description": "Pharmaceutical grade Organic Mother Tincture Base Alcohol 96% (5 Litres) distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 2800,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 2520,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 2380,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 2100,
        "discountPercentage": 25
      }
    ],
    "retailStock": 8,
    "bulkStock": 45,
    "reorderLevel": 12,
    "expiryDate": "2030-01-01",
    "batchNumber": "BAT-2026-159",
    "unit": "Unit",
    "packagingUnit": "Container",
    "labCertified": true,
    "activeStatus": "In Stock"
  },
  {
    "id": "PRD-MED-060",
    "name": "Arnica Montana Mother Tincture Bulk Base (2.5 Litres)",
    "sku": "BLK-ARN-002",
    "category": "Bulk Raw Compounds",
    "potency": "1:10 Extraction Strength",
    "description": "Pharmaceutical grade Arnica Montana Mother Tincture Bulk Base (2.5 Litres) distributed under SAHPRA Category A/D guidelines with certified batch COA certificates.",
    "retailPrice": 4500,
    "bulkTierPrices": [
      {
        "packSize": 12,
        "unitPrice": 4050,
        "discountPercentage": 10
      },
      {
        "packSize": 24,
        "unitPrice": 3825,
        "discountPercentage": 15
      },
      {
        "packSize": 48,
        "unitPrice": 3375,
        "discountPercentage": 25
      }
    ],
    "retailStock": 5,
    "bulkStock": 28,
    "reorderLevel": 8,
    "expiryDate": "2029-06-30",
    "batchNumber": "BAT-2026-160",
    "unit": "Unit",
    "packagingUnit": "Container",
    "labCertified": true,
    "activeStatus": "In Stock"
  }
];

export const initialPrescriptions: Prescription[] = [
  {
    "id": "rx-2026-001",
    "prescriptionNumber": "RX-ZA-9821",
    "patientId": "usr-patient-1",
    "patientName": "Sarah Meyer",
    "prescribingDoctor": "Dr. Hendrik van der Merwe",
    "prescriberHpcsa": "MP0482910",
    "clinicName": "Cape Integrative Family Practice",
    "productName": "Full Spectrum CBD Oil 1000mg 30ml",
    "productId": "PRD-MED-001",
    "conditionTag": "Chronic Neuropathic Pain",
    "dosage": "0.5ml sublingually BID (morning and evening)",
    "instructions": "Titrate by 0.25ml weekly until symptom control achieved. Maintain hydration.",
    "prescribedQuantity": 2,
    "refillsRemaining": 3,
    "issuedDate": "2026-10-05",
    "refillDueDate": "2026-11-04",
    "status": "Active",
    "clinicalOutcomeNotes": "VAS pain score decreased from 8/10 to 4/10 over 6 weeks. No adverse sedation."
  },
  {
    "id": "rx-2026-002",
    "prescriptionNumber": "RX-ZA-9822",
    "patientId": "usr-patient-1",
    "patientName": "Sarah Meyer",
    "prescribingDoctor": "Dr. Thandiwe Khumalo",
    "prescriberHpcsa": "MP0821944",
    "clinicName": "Gauteng Neuro-Psychiatric Institute",
    "productName": "Anxiety & Nervous Tension Complex Drops 50ml",
    "productId": "PRD-MED-046",
    "conditionTag": "Anxiety & Panic",
    "dosage": "15 drops in water TID after meals",
    "instructions": "Combine with deep breathing exercises during panic surges.",
    "prescribedQuantity": 1,
    "refillsRemaining": 2,
    "issuedDate": "2026-09-28",
    "refillDueDate": "2026-10-28",
    "status": "Refill Due",
    "clinicalOutcomeNotes": "GAD-7 anxiety index reduced from 16 (severe) to 9 (mild). Refill approved."
  },
  {
    "id": "rx-2026-003",
    "prescriptionNumber": "RX-ZA-9823",
    "patientId": "usr-patient-1",
    "patientName": "Sarah Meyer",
    "prescribingDoctor": "Dr. Hendrik van der Merwe",
    "prescriberHpcsa": "MP0482910",
    "clinicName": "Cape Integrative Family Practice",
    "productName": "Arnica Montana 30C Pellets (80 Doses)",
    "productId": "PRD-MED-033",
    "conditionTag": "Arthritic Inflammation",
    "dosage": "4 sucrose globules dissolved sublingually PRN (max 4 times daily)",
    "instructions": "Avoid strong camphor or coffee for 20 minutes before and after dosing.",
    "prescribedQuantity": 3,
    "refillsRemaining": 1,
    "issuedDate": "2026-08-15",
    "refillDueDate": "2026-11-15",
    "status": "Active",
    "clinicalOutcomeNotes": "Reported reduction in morning joint stiffness and improved hand mobility."
  }
];

export const initialPharmacistReferrals: PharmacistReferral[] = [
  {
    "id": "ref-901",
    "referralCode": "REF-TM-819",
    "pharmacistId": "usr-pharmacist-1",
    "pharmacistName": "Tariq Moodley (Pharmacist)",
    "pharmacistHpcsa": "PH0284711",
    "patientName": "Sarah Meyer",
    "patientContact": "+27 82 491 0294",
    "prescribedTherapy": "Full Spectrum CBD Oil 1000mg",
    "orderAmount": 1300,
    "commissionRate": 0.085,
    "commissionEarned": 110.5,
    "status": "Approved",
    "timestamp": "2026-10-24 14:15"
  },
  {
    "id": "ref-902",
    "referralCode": "REF-TM-820",
    "pharmacistId": "usr-pharmacist-1",
    "pharmacistName": "Tariq Moodley (Pharmacist)",
    "pharmacistHpcsa": "PH0284711",
    "patientName": "David Kitching",
    "patientContact": "+27 83 291 8841",
    "prescribedTherapy": "CBD Joint Mobility Complex Capsules",
    "orderAmount": 1740,
    "commissionRate": 0.085,
    "commissionEarned": 147.9,
    "status": "Settled",
    "timestamp": "2026-10-18 10:40"
  },
  {
    "id": "ref-903",
    "referralCode": "REF-TM-821",
    "pharmacistId": "usr-pharmacist-1",
    "pharmacistName": "Tariq Moodley (Pharmacist)",
    "pharmacistHpcsa": "PH0284711",
    "patientName": "Annelize Van Zyl",
    "patientContact": "+27 84 992 1042",
    "prescribedTherapy": "CBD Night Drops with CBN & Chamomile",
    "orderAmount": 2160,
    "commissionRate": 0.085,
    "commissionEarned": 183.6,
    "status": "Pending Verification",
    "timestamp": "2026-10-29 16:30"
  }
];

export const initialWellnessAppointments: WellnessAppointment[] = [
  {
    "id": "apt-501",
    "appointmentRef": "APT-LST-101",
    "clientName": "Chloe Du Plessis",
    "clientEmail": "chloe.dp@lifestylehealth.co.za",
    "clientPhone": "+27 82 771 9021",
    "consultationType": "CBD Phytocannabinoid Assessment",
    "practitioner": "Dr. Hendrik van der Merwe",
    "date": "2026-11-05",
    "timeSlot": "10:00 - 10:45 AM",
    "status": "Confirmed",
    "notes": "Lifestyle client seeking non-intoxicating stress management for marathon training.",
    "wellnessProductRecommendations": [
      "CBD Cryo-Cooling Balm 100ml",
      "Broad Spectrum 1000mg Drops"
    ]
  },
  {
    "id": "apt-502",
    "appointmentRef": "APT-LST-102",
    "clientName": "Markus Becker",
    "clientEmail": "markus.becker@executivehealth.co.za",
    "clientPhone": "+27 83 401 2290",
    "consultationType": "Stress & Sleep Lifestyle Routine",
    "practitioner": "Dr. Thandiwe Khumalo",
    "date": "2026-11-08",
    "timeSlot": "14:30 - 15:15 PM",
    "status": "Confirmed",
    "notes": "Executive burnout and sleep architecture optimization consultation.",
    "wellnessProductRecommendations": [
      "CBD Sleep PM Softgels",
      "Anxiety Relief Drops"
    ]
  }
];

export const initialPaymentReminders: PaymentReminderAlert[] = [
  {
    "invoiceId": "inv-2026-101",
    "invoiceNumber": "INV-2026-101",
    "clientName": "MedCentre Health Sandton",
    "dueDate": "2026-11-02",
    "daysRemaining": 1,
    "alertTier": "final-1d",
    "amount": 15420.5,
    "badgeLabel": "Final Notice (Due Tomorrow)",
    "dispatchedNotice": true
  },
  {
    "invoiceId": "inv-2026-102",
    "invoiceNumber": "INV-2026-102",
    "clientName": "Pretoria East Wellness Dispensary",
    "dueDate": "2026-11-04",
    "daysRemaining": 3,
    "alertTier": "urgent-3d",
    "amount": 28900,
    "badgeLabel": "Urgent Payment Alert (3 Days Left)",
    "dispatchedNotice": true
  },
  {
    "invoiceId": "inv-2026-103",
    "invoiceNumber": "INV-2026-103",
    "clientName": "Durban North Integrative Pharmacy",
    "dueDate": "2026-11-08",
    "daysRemaining": 7,
    "alertTier": "notice-7d",
    "amount": 41250,
    "badgeLabel": "Advance Payment Notice (7 Days Left)",
    "dispatchedNotice": false
  },
  {
    "invoiceId": "inv-2026-098",
    "invoiceNumber": "INV-2026-098",
    "clientName": "Rosebank Compounding Clinic",
    "dueDate": "2026-10-25",
    "daysRemaining": -7,
    "alertTier": "overdue",
    "amount": 19800,
    "badgeLabel": "7 Days Overdue - Credit Hold Pending",
    "dispatchedNotice": true
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ord-2026-001',
    orderNumber: 'ORD-8419',
    clientId: 'usr-pharmacy-1',
    clientName: 'MedCentre Health Group (Sandton)',
    clientType: 'Pharmacy',
    orderDate: '2026-10-24',
    items: [
      {
        productId: 'PRD-MED-001',
        productName: 'Full Spectrum CBD Oil 1000mg 30ml',
        sku: 'CBD-FS-1000',
        packSize: 24,
        packCount: 2,
        totalUnits: 48,
        unitPrice: 650,
        grossTotal: 31200,
        discountAmount: 4680,
        netTotal: 26520,
      },
      {
        productId: 'PRD-MED-033',
        productName: 'Arnica Montana 30C Pellets (80 Doses)',
        sku: 'HOM-ARN-030',
        packSize: 48,
        packCount: 1,
        totalUnits: 48,
        unitPrice: 185,
        grossTotal: 8880,
        discountAmount: 2220,
        netTotal: 6660,
      },
    ],
    grossSubtotal: 40080,
    discountAmount: 6900,
    netSubtotal: 33180,
    vatAmount: 4977,
    totalAmount: 38157,
    status: 'Processing',
    paymentTerms: '30 Days Net',
    invoiceId: 'INV-2026-8419',
  },
  {
    id: 'ord-2026-002',
    orderNumber: 'ORD-8420',
    clientId: 'usr-pharmacy-1',
    clientName: 'MedCentre Health Group (Sandton)',
    clientType: 'Pharmacy',
    orderDate: '2026-10-18',
    items: [
      {
        productId: 'PRD-MED-011',
        productName: 'CBD Softgels 25mg (30 Capsules)',
        sku: 'CBD-CAP-025',
        packSize: 24,
        packCount: 1,
        totalUnits: 24,
        unitPrice: 490,
        grossTotal: 11760,
        discountAmount: 1764,
        netTotal: 9996,
      },
      {
        productId: 'PRD-MED-019',
        productName: 'CBD Cryo-Cooling Muscle Relief Balm 100ml',
        sku: 'TOP-CAL-100',
        packSize: 12,
        packCount: 2,
        totalUnits: 24,
        unitPrice: 380,
        grossTotal: 9120,
        discountAmount: 912,
        netTotal: 8208,
      },
    ],
    grossSubtotal: 20880,
    discountAmount: 2676,
    netSubtotal: 18204,
    vatAmount: 2730.60,
    totalAmount: 20934.60,
    status: 'Delivered',
    paymentTerms: '30 Days Net',
    invoiceId: 'INV-2026-8420',
  },
];

export const initialInvoices: Invoice[] = [
  {
    id: 'inv-2026-8419',
    invoiceNumber: 'INV-2026-8419',
    orderId: 'ord-2026-001',
    orderNumber: 'ORD-8419',
    clientName: 'MedCentre Health Group (Sandton)',
    clientAddress: '150 Rivonia Road, Sandton, Johannesburg, 2196',
    clientVatNumber: 'ZA491029481',
    issueDate: '2026-10-24',
    dueDate: '2026-11-23',
    grossSubtotal: 40080,
    discountAmount: 6900,
    netSubtotal: 33180,
    vatRate: 0.15,
    vatAmount: 4977,
    totalAmount: 38157,
    status: 'Sent',
    daysOverdue: 0,
    items: [
      {
        description: 'Full Spectrum CBD Oil 1000mg (Pack of 24 x 2)',
        quantity: 48,
        unitPrice: 552.50,
        total: 26520,
      },
      {
        description: 'Arnica Montana 30C Pellets (Pack of 48 x 1)',
        quantity: 48,
        unitPrice: 138.75,
        total: 6660,
      },
    ],
  },
  {
    id: 'inv-2026-8420',
    invoiceNumber: 'INV-2026-8420',
    orderId: 'ord-2026-002',
    orderNumber: 'ORD-8420',
    clientName: 'MedCentre Health Group (Sandton)',
    clientAddress: '150 Rivonia Road, Sandton, Johannesburg, 2196',
    clientVatNumber: 'ZA491029481',
    issueDate: '2026-10-18',
    dueDate: '2026-11-17',
    grossSubtotal: 20880,
    discountAmount: 2676,
    netSubtotal: 18204,
    vatRate: 0.15,
    vatAmount: 2730.60,
    totalAmount: 20934.60,
    status: 'Paid',
    daysOverdue: 0,
    items: [
      {
        description: 'CBD Softgels 25mg (Pack of 24 x 1)',
        quantity: 24,
        unitPrice: 416.50,
        total: 9996,
      },
      {
        description: 'CBD Cryo-Cooling Balm 100ml (Pack of 12 x 2)',
        quantity: 24,
        unitPrice: 342.00,
        total: 8208,
      },
    ],
  },
  {
    id: 'inv-2026-8411',
    invoiceNumber: 'INV-2026-8411',
    orderId: 'ord-2026-000',
    orderNumber: 'ORD-8399',
    clientName: 'Pretoria East Wellness Dispensary',
    clientAddress: 'Corner Garsfontein & Netcare Way, Pretoria, 0081',
    clientVatNumber: 'ZA471092841',
    issueDate: '2026-09-15',
    dueDate: '2026-10-15',
    grossSubtotal: 16500,
    discountAmount: 2475,
    netSubtotal: 14025,
    vatRate: 0.15,
    vatAmount: 2103.75,
    totalAmount: 16128.75,
    status: 'Overdue',
    daysOverdue: 17,
    items: [
      {
        description: 'Full Spectrum CBD Oil 1000mg (Pack of 24 x 1)',
        quantity: 24,
        unitPrice: 584.38,
        total: 14025,
      },
    ],
  },
];

export const initialStockTransfers: StockTransferAudit[] = [
  {
    id: 'trf-001',
    transferRef: 'TRF-9012',
    timestamp: '2026-10-28 09:30',
    productId: 'PRD-MED-001',
    productName: 'Full Spectrum CBD Oil 1000mg 30ml',
    quantity: 50,
    sourcePool: 'bulk',
    targetPool: 'retail',
    authorizedBy: 'Thomas (Managing Director)',
    reason: 'Urgent Retail Restock: Patient chronic refill demand spike',
    notes: 'Dual-Pool Protocol: Verified sufficient bulk reserve buffer remaining.',
    verified: true,
  },
  {
    id: 'trf-002',
    transferRef: 'TRF-9118',
    timestamp: '2026-10-22 14:15',
    productId: 'PRD-MED-033',
    productName: 'Arnica Montana 30C Pellets (80 Doses)',
    quantity: 100,
    sourcePool: 'bulk',
    targetPool: 'retail',
    authorizedBy: 'Thomas (Managing Director)',
    reason: 'Homeopathic clinical inventory reallocation',
    notes: 'Verified batch expiration: 2028-10-31 (Optimal Shelf Life)',
    verified: true,
  },
];

export const initialRevenueData: RevenueDataPoint[] = [
  { month: 'May', retailRevenue: 48000, bulkRevenue: 85000, leisureRevenue: 18000, totalGrowth: '+12%' },
  { month: 'Jun', retailRevenue: 52000, bulkRevenue: 110000, leisureRevenue: 22000, totalGrowth: '+18%' },
  { month: 'Jul', retailRevenue: 59000, bulkRevenue: 145000, leisureRevenue: 26000, totalGrowth: '+22%' },
  { month: 'Aug', retailRevenue: 64000, bulkRevenue: 195000, leisureRevenue: 31000, totalGrowth: '+28%' },
  { month: 'Sep', retailRevenue: 71000, bulkRevenue: 260000, leisureRevenue: 38000, totalGrowth: '+36%' },
  { month: 'Oct', retailRevenue: 78000, bulkRevenue: 345000, leisureRevenue: 44000, totalGrowth: '+48%' },
];

export const revenueSegregationSplits: RevenueSegregationSplit[] = [
  { channel: 'B2B Bulk Pharmacy', percentage: 62, amount: 403000, color: '#047857' },
  { channel: 'Direct Retail OTC', percentage: 25, amount: 162500, color: '#0284c7' },
  { channel: 'Leisure & Wellness', percentage: 13, amount: 84500, color: '#0e7490' },
];
