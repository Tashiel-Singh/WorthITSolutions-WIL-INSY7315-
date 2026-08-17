# Rolling Stoned Natural Health Management System (MedFlow)

### INSY7315 Work Integrated Learning (WIL) Prototype
**Developer:** WorthIT Solutions  
**Client:** Rolling Stoned Natural Health (Pty) Ltd  
**Project Version:** 1.0.0 (Prototype)

---

## Overview

This repository contains the interactive frontend prototype developed by WorthIT Solutions for Rolling Stoned Natural Health (Pty) Ltd as part of the INSY7315 Work Integrated Learning (WIL) curriculum.

The system addresses core operational requirements:
- Dual-channel inventory segregation (Bulk Clinic Supplies vs. Direct Retail)
- Automated bulk-to-retail stock transfers with audit trails
- SARS-compliant tax calculation and deduction modeling (Section 11(e) wear and tear, Section 18A, and standard 15% VAT)
- B2B bulk ordering workflows with volume pricing tiers
- Invoicing and automated payment reminder scheduling
- Executive reporting and role-based access control

---

## Technical Stack

- **Runtime / Bundler:** Vite 5.x
- **Core Architecture:** Vanilla JavaScript (ES Modules, Component-driven design)
- **State Management:** Reactive Pub/Sub State Store with LocalStorage persistence
- **Styling:** Modular CSS with CSS Custom Properties (Design tokens for light, dark, and system modes)
- **Typography:** Plus Jakarta Sans and JetBrains Mono

---

## Prototype Screen Index

The prototype is organized into 12 core functional views:

| # | Screen Name | Route / Identifier | Description |
|---|---|---|---|
| 01 | Authentication | `login` | Multi-role secure login portal with demo account switchers |
| 02 | Operational Dashboard | `dashboard` | KPI metrics, stock alerts, quick actions, and revenue summary |
| 03 | Tax Optimization Engine | `tax-engine` | Interactive SARS wear-and-tear (Section 11(e)) and VAT deduction calculator |
| 04 | Revenue Segregation | `revenue-segregation` | Financial breakdown distinguishing bulk clinic vs retail revenue streams |
| 05 | Inventory Stock Overview | `inventory-overview` | Comprehensive stock level monitoring with low-stock warnings |
| 06 | Stock Segregation Transfer | `bulk-segregation` | Interactive conversion tool to transfer bulk units into retail stock |
| 07 | Bulk Ordering Portal | `bulk-order` | Multi-item B2B ordering interface with volume-tier discounts |
| 08 | Tax Invoicing Engine | `invoicing` | SARS-compliant tax invoice generation, status tracking, and PDF export |
| 09 | Order Management | `order-management` | End-to-end order processing, filtering, and status updates |
| 10 | Payment Reminders | `payment-reminders` | Configurable multi-tier automated overdue payment notification manager |
| 11 | Executive Dashboard | `executive-dashboard` | High-level analytics, year-over-year revenue graphs, and performance metrics |
| 12 | System Settings | `settings` | Company details, banking data, VAT config, and theme preferences |

---

## Demo Credentials

For testing and demonstration, use the pre-configured accounts:

### 1. System Administrator
- **Username:** `admin`
- **Password:** `password123`
- **User:** John Admin (System Administrator & Operations Manager)
- **Access Level:** Full access to all modules, administrative controls, and system settings.

### 2. Clinic Client (B2B Bulk)
- **Username:** `dr.naidoo`
- **Password:** `password123`
- **User:** Dr. Thabo Naidoo (Chief Medical Officer, St. Mary's Clinic)
- **Access Level:** B2B bulk orders, invoices, and clinic-specific dashboards.

### 3. Retail Customer (B2C)
- **Username:** `sarah.m`
- **Password:** `password123`
- **User:** Sarah Meyer (Retail Customer)
- **Access Level:** Retail product browsing and order placement.

---

## Directory Structure

```text
├── index.html                  # HTML entry point
├── package.json                # Project scripts and dependencies
├── src
│   ├── app.js                  # Main application orchestrator and screen router
│   ├── main.js                 # App initialization
│   ├── components
│   │   ├── admin               # Admin-specific management views
│   │   ├── auth                # Authentication screens
│   │   ├── client              # Client and patient portal views
│   │   ├── common              # Shared components (Header, Sidebar, Modal, Toast, Icons)
│   │   ├── doctor              # Medical practitioner views
│   │   └── screens             # 12 primary prototype workflow screens
│   ├── data
│   │   └── mockData.js         # Domain data, sample products, invoices, and users
│   ├── store
│   │   └── state.js            # State store, theme detection, and persistence
│   └── styles
│       ├── main.css            # Base stylesheet, layouts, and screen styles
│       └── variables.css       # CSS custom properties and color variables
└── dist                        # Production build output
```

---

## Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Tashiel-Singh/WorthITSolutions-WIL-INSY7315-.git
   cd WorthITSolutions-WIL-INSY7315-
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local address displayed in the terminal (typically `http://localhost:5173`).

---

## Available Scripts

- `npm run dev`: Starts the Vite local development server with Hot Module Replacement (HMR).
- `npm run build`: Compiles and bundles production-ready assets into the `dist/` directory.
- `npm run preview`: Locally previews the production build.

---

## State Persistence Note

The prototype stores user sessions, inventory counts, orders, invoices, and theme preferences in browser `localStorage`. To reset the prototype back to default seed data, navigate to **Settings** and select **Reset Prototype Data**, or clear site data in your browser developer tools.

---

## License

This project is developed for academic evaluation under the INSY7315 Work Integrated Learning module. Proprietary to WorthIT Solutions and Rolling Stoned Natural Health (Pty) Ltd.
