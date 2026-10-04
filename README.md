# WorthIT Solutions ERP — Core Logic & Algorithm Module (Role 2)

![TypeScript](https://shields.io)
![PostgreSQL](https://shields.io)
![Prisma](https://shields.io)
![Jest](https://shields.io)

## 📌 Executive Summary
This repository contains the backend core logic, financial algorithms, and data processing services engineered for Thomas's licensed CBD and homeopathic distribution enterprise. Following rigorous discovery and sprint consultancy phases, the business officially pivoted from an error-prone, manual retail operation to an automated B2B bulk distribution model servicing pharmacies, medical practitioners, and wellness clients. 

This module replaces fragmented, un-audited spreadsheets with deterministic, high-performance TypeScript services designed to guarantee financial accuracy, eliminate inventory cannibalization, and automate supply-chain scaling.

---

## 🎯 The Enterprise Pivot: Problem, Solution & Impact

| Operational Vector | Legacy Bottleneck (Pre-Sprint) | Architectural Solution (Role 2) | Quantifiable Business Impact |
| :--- | :--- | :--- | :--- |
| **Financials & Tax Compliance** | • Manual spreadsheet tracking<br>• Zero deduction automation<br>• High risk of audit failure | `TaxCalculationService`<br>`FormalTaxDeductionService`<br><br>Implements Strategy Pattern and multi-variable deduction formulas. | • **100% calculation accuracy**<br>• Reclaimed historical tax deductions<br>• Fully automated asset/expense auditing |
| **Supply Chain & Inventory** | • Manual stock ledgers<br>• High frequency of stockouts<br>• Uncontrolled stock bleeding | `InventoryService`<br><br>Enforces strict boundary isolation and cannibalization-prevention logic. | • **Eliminated stock cannibalization**<br>• Secured exclusive wholesale reserves for pharmacy contracts |
| **Revenue & B2B Invoicing** | • Manual B2B invoicing<br>• Untracked channel growth<br>• Ad-hoc discount pricing | `RevenueSegregationService`<br>`BulkOrderCalculationService`<br><br>Automates channel splitting and tiered bulk discounting (10% to 15%) with 15% VAT splitting. | • **70% reduction in invoicing time**<br>• Bulk revenue scaled to represent the majority of total enterprise turnover |

---

## 🏛️ System Architecture & Data Flow

```text
       [ PostgreSQL / Prisma ORM ]
                    │
                    │ (Raw Sales & Audit Logs)
                    ▼
         [ API Controllers (Role 3) ]
                    │
                    │ (Typed Payload Ingestion)
                    ▼
          [ Core Services (Role 2) ]
                    │
                    ├──> 1. Tax Calculation Strategy
                    ├──> 2. Inventory Pool Isolation
                    ├──> 3. Revenue Channel Segregation
                    └──> 4. Bulk Tier Discount & VAT Engine
                    │
                    │ (Pure JSON Output)
                    ▼
       [ Frontend Dashboards (Role 1) ]
```

---

## ⚙️ Core Technical Implementation

### 1. Formal Tax Deduction Engine (`FormalTaxDeductionService.ts`)
Encapsulates the multi-variable tax deduction formula audited during Sprint 2:

```text
Total Deduction = (Σ Depreciable Assets × 0.20) 
                  + (Σ Operational Expenses × 0.15) 
                  + (Bulk Revenue × 0.05 VAT Input)
```

* **Design Rationale:** Operates as a stateless static utility to ensure side-effect-free execution during high-throughput financial audits.

### 2. Inventory Pool Isolation (`InventoryService.ts`)
Implements strict validation logic preventing retail allocation threads from tapping into wholesale reserve pools. 
* **Mechanism:** Validates SKU metadata and pool flags prior to committing stock decrements, completely eliminating cross-channel inventory contamination.

### 3. Multi-Channel Revenue Segregation (`RevenueSegregationService.ts`)
Aggregates incoming transaction logs in memory to segregate financial streams across distinct operational channels:
* `PATIENT` (Direct retail consumer purchases)
* `PHARMACY` (B2B bulk wholesale orders)
* `LEISURE` (Wellness and spa client accounts)

### 4. Automated Bulk Pricing & VAT Split (`BulkOrderCalculationService.ts`)
Programmatically evaluates order volume thresholds to apply tiered discounts before calculating the statutory 15% VAT split for invoice generation:
* **Tier 1 (≥ 50 units):** 15% bulk discount applied
* **Tier 2 (20 - 49 units):** 10% bulk discount applied
* **Tier 3 (< 20 units):** Standard retail pricing (0% discount)

---

## 🧪 Quality Assurance & Test Coverage
* **Test Framework:** Node.js, TypeScript, and Jest.
* **Coverage Standards:** Maintains **>96% test coverage** across all statements, branches, and functions.

### Running the Suite Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Execute all unit and integration tests:**
   ```bash
   npm run test
   ```

3. **Generate a detailed test coverage report:**
   ```bash
   npm run test:cov
   ```
