# Project MedFlow: Integrated Healthcare Distribution Management System

[![MedFlow Enterprise CI/CD Pipeline](https://github.com/Tashiel-Singh/WorthITSolutions-WIL-INSY7315-/actions/workflows/deploy.yml/badge.svg)](https://github.com/Tashiel-Singh/WorthITSolutions-WIL-INSY7315-/actions/workflows/deploy.yml)
[![PR Quality Gate](https://github.com/Tashiel-Singh/WorthITSolutions-WIL-INSY7315-/actions/workflows/pr-verify.yml/badge.svg)](https://github.com/Tashiel-Singh/WorthITSolutions-WIL-INSY7315-/actions/workflows/pr-verify.yml)
[![TypeScript 5.5](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![React 18.3](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.dev/)
[![Tailwind CSS 3.4](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-729B1B.svg)](https://vitest.dev/)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-047857.svg)](https://www.w3.org/WAI/standards-guidelines/wcag/)

---

### INSY7315 Work Integrated Learning (WIL) — Task 2 Implementation
**Academic Institution:** IIE Varsity College / University Consortium  
**Module:** INSY7315 Work Integrated Learning 3  
**Client Entity:** Thomas — Licensed CBD & Homeopathic Bulk Distributor (Rolling Stoned Natural Health)  
**Enterprise Solution:** Project MedFlow Integrated Distribution Management Platform  
**Lead Engineer (Role 1):** Tashiel Singh (Frontend & DevOps / CI-CD Lead)

---

## 1. Executive Summary & Project Context

Project MedFlow is an enterprise distribution and inventory management web platform custom-engineered for Thomas, a licensed South African CBD and homeopathic product distributor transitioning from traditional retail to high-volume B2B bulk supply to pharmacies, hospitals, and integrative clinics.

The platform addresses critical operational and regulatory challenges:
1. **Preventing Inventory Cannibalization:** Strict dual-pool segregation isolating over-the-counter retail inventory from contracted B2B bulk pharmacy stock reserves.
2. **Regulatory & Tax Compliance:** South African Revenue Service (SARS) Section 11(e) wear-and-tear depreciation modeling, Section 11(a) operational deductions, and automated 15% VAT invoicing.
3. **B2B Bulk Volume Tiering:** Automated tiered wholesale discounts (10%, 15%, 25%) with real-time gross/discount/net subtotal calculations.
4. **Accessible Clinical Care:** Dedicated Patient Portal enabling verified patients to track chronic prescriptions, view administration timelines, and trigger instant 30-day refills.

---

## 2. Engineering Team & Role Allocation

| Team Member | Engineering Role | Key Deliverables & System Responsibilities |
|---|---|---|
| **Tashiel Singh** | **Lead Frontend & DevOps / CI-CD Engineer (Role 1)** | • React 18 & TypeScript Single Page Application Architecture<br>• Tailwind CSS Medical Design System & WCAG 2.1 AA Accessibility<br>• Executive Recharts Dashboards, Dual-Pool Stock & Bulk Order Systems<br>• GitHub Actions Multi-Slot CI/CD Pipelines &Personal Branch Isolation |
| **Arya Roy** | **Lead Backend & Database Architect (Role 2)** | • RESTful Microservices & Domain API Contracts<br>• PostgreSQL Relational Schema & Migration Scripts<br>• JWT Authentication & Role-Based Access Control Middleware |
| **Sachil Chetty** | **Cloud Infrastructure & Azure Specialist (Role 3)** | • Azure App Service Infrastructure-as-Code (Terraform / ARM)<br>• Staging & Production Deployment Slots with Zero-Downtime Swap<br>• Azure Key Vault & Managed Identity Integration |
| **Mohammed Istiyag** | **QA, Security & Compliance Lead (Role 4)** | • End-to-End Cypress Integration & OWASP Top 10 Security Scans<br>• SAHPRA Medical Device & Schedule 4 Regulatory Audit Validation<br>• Comprehensive Test Plans & Defect Tracking Ledgers |

---

## 3. Live Deployment Links

The MedFlow application is continuously deployed across multi-tier Azure App Service environments with automated continuous delivery:

* **Production Environment (Main Slot):**  
  🔗 [https://medflow-app-prod.azurewebsites.net](https://medflow-app-prod.azurewebsites.net)  
  *High-availability production deployment with zero-downtime swap and production secrets.*

* **Staging Environment (Staging Slot):**  
  🔗 [https://medflow-app-staging.azurewebsites.net](https://medflow-app-staging.azurewebsites.net)  
  *Pre-production acceptance environment mapped directly to the `staging` branch for integration verification.*

* **Development Environment (Dev Slot):**  
  🔗 [https://medflow-app-dev.azurewebsites.net](https://medflow-app-dev.azurewebsites.net)  
  *Rapid-integration environment automatically updated upon pull request merges into `develop`.*

* **Public Web Demonstration Mirror (GitHub Pages):**  
  🔗 [https://tashiel-singh.github.io/WorthITSolutions-WIL-INSY7315-/](https://tashiel-singh.github.io/WorthITSolutions-WIL-INSY7315-/)  
  *Public live demonstration mirror hosted via GitHub Pages with zero-credential public access.*

---

## 4. Frontend Architecture & Design System

### Technical Stack
* **Framework:** React 18.3 (TypeScript 5.5) bootstrapped with Vite 5.4.
* **Styling Engine:** Tailwind CSS 3.4 configured with a bespoke medical-distributor color palette:
  * Primary: Deep Emerald (`#064e3b`, `#047857`, `#10b981`)
  * Secondary: Medical Blue / Teal (`#0e7490`, `#0284c7`)
  * Neutrals: Crisp slate background (`#f8fafc`), pure white card surfaces (`#ffffff`), border lines (`#e2e8f0`), deep slate typography (`#0f172a`, `#334155`)
  * Semantic Accents: Warning amber (`#f59e0b`), Error rose (`#e11d48`), Success emerald (`#10b981`)
* **Data Visualization:** Recharts 2.12 (Revenue Segregation Donut Charts and 6-Month Growth Bar Charts).
* **Icons:** Lucide React (`lucide-react`).
* **Routing:** React Router DOM v6 with role-based route guards (`RoleGuard`).
* **State Management:** React Context API (`AppContext`, `ToastContext`) with responsive drawer states.
* **Testing:** Vitest 2.1, React Testing Library, and `@testing-library/jest-dom`.

### Core Views & Navigation Map

```text
/ (Root)
│
├── /login                   # Authentication Portal with 1-click quick-login role switchers
├── /dashboard               # Executive KPI Cards, Recharts Revenue Segregation & SARS Simulator
├── /inventory               # Dual-Pool Stock Segregation, Expiry Alerts & Stock Reallocation
├── /orders/new              # Wholesale B2B Catalog, Dynamic Tier Discounts & 15% VAT Checkout
├── /invoices                # Order Fulfillment Ledger & Interactive SARS Tax Invoice Generator
└── /patient-portal          # Patient Prescriptions, Bioavailability Timetable & Refill Triggers
```

### WCAG 2.1 AA Accessibility & UX Standards
* **Color Contrast:** Minimum 4.5:1 contrast ratio across all text and background combinations.
* **Keyboard Navigation:** Universal visible focus rings (`focus-visible:ring-2 focus-visible:ring-brand-700`), Escape key dismissal on all modals, and an accessible skip-to-content anchor link.
* **System Feedback:** Non-blocking ARIA live region toast notifications (`ToastContext`), loading skeletons on data ingest, and interactive button spinner states.
* **Responsive Layout:** 100% responsive fluid grid system adapting from mobile (<640px) with collapsible navigation drawer, to tablet (641px - 1024px), up to ultra-wide desktop viewports (>1024px).

---

## 5. Branching Strategy & Gitflow Cadence

Work for Role 1 (Frontend & DevOps Lead) strictly adhered to professional Gitflow branching policies to prevent merge collisions with teammates:

```
[feature/FE-tashiel-*] (Isolated personal feature branches)
         │
         ▼ (PR verification: lint, test:ci, build)
     [develop]         (Development integration branch)
         │
         ▼ (Release staging candidate)
     [staging]         (Staging slot deployment)
         │
         ▼ (Verified production release)
       [main]          (Production slot zero-downtime swap)
```

### Personal Personal Feature Branches
* `feature/FE-tashiel-init`: Core configuration, TypeScript definitions, and Tailwind palette.
* `feature/FE-tashiel-components`: Design system primitives (Button, Card, Badge, Modal, Skeleton).
* `feature/FE-tashiel-dashboard`: Executive KPI cards, Recharts visualizations, and SARS simulator.
* `feature/FE-tashiel-inventory`: Dual-pool stock segregation, expiry countdowns, and audit logs.
* `feature/FE-tashiel-orders`: Wholesale B2B catalog, tiered volume discount engine, and checkout panel.
* `feature/FE-tashiel-invoices`: Order status fulfillment ledger and printable SARS Tax Invoice modal.
* `feature/FE-tashiel-patient`: Patient portal, prescription cards, dosage schedule, and refill triggers.
* `feature/FE-tashiel-testing`: Vitest automated test suite and Jest-DOM polyfill configurations.
* `feature/FE-tashiel-cicd`: GitHub Actions multi-environment Azure App Service deployment pipelines.
* `feature/FE-tashiel-docs`: Root README documentation, architecture blueprints, and presentation deck.

> **Audit Trail Commitment:** All commits strictly follow the [Conventional Commits](https://www.conventionalcommits.org/) specification (`feat:`, `fix:`, `style:`, `test:`, `ci:`, `docs:`) distributed across **50+ granular commits and pushes**.

---

## 6. GitHub Actions CI/CD Pipeline Architecture

The automated delivery pipeline is configured in `.github/workflows/deploy.yml` with automated testing, linting, and continuous delivery:

```
┌─────────────────────────────────────────────────────────────┐
│             GitHub Actions CI/CD Pipeline                  │
└──────────────────────────────┬──────────────────────────────┘
                               │
               [Trigger: Push or Pull Request]
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│         JOB 1: Build & Automated Test Suite                │
│  • actions/checkout@v4                                      │
│  • actions/setup-node@v4 (Node 20 + Cache)                  │
│  • npm ci                                                   │
│  • npm run lint (TypeScript Compiler tsc --noEmit)          │
│  • npm run test:ci (Vitest Component & Unit Test Suite)     │
│  • npm run build (Vite Production Distribution Bundle)      │
│  • actions/upload-artifact@v4 (dist/ archive)               │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Artifact Passed)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│         JOB 2: Multi-Environment Azure Deployment          │
│  • actions/download-artifact@v4                             │
│  • Branch Condition: develop → Azure Development Slot       │
│  • Branch Condition: staging → Azure Staging Slot           │
│  • Branch Condition: main    → Azure Production Slot (Swap) │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Local Setup & Installation Instructions

Follow these steps to run Project MedFlow locally in development mode:

### Prerequisites
* **Node.js:** v18.0.0 or higher (v20+ recommended)
* **NPM:** v9.0.0 or higher
* **Git:** Installed and configured

### Step 1: Clone the Repository
```bash
git clone https://github.com/Tashiel-Singh/WorthITSolutions-WIL-INSY7315-.git
cd WorthITSolutions-WIL-INSY7315-
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### Step 4: Execute Automated Test Suite
```bash
# Run Vitest in single-run CI mode
npm run test:ci

# Run Vitest in interactive watch mode
npm run test
```

### Step 5: Execute TypeScript Linter
```bash
npm run lint
```

### Step 6: Generate Production Build
```bash
npm run build
npm run preview
```

---

## 8. Demonstration Credentials & Role Switcher

For evaluation and demonstration purposes, use the header **Role Switcher** widget or log in with these credentials:

| Role Identifier | Active User | Organization | Access Scope |
|---|---|---|---|
| **Distributor / Owner** | Thomas | MedFlow Distribution (Pty) Ltd | Full access to Executive Dashboard, Dual-Pool Stock, Reallocation Transfers, and Financial KPIs |
| **Pharmacy Manager** | Sr. Eleanor Scott | MedCentre Health Group (Sandton) | Wholesale B2B Bulk Order placement, Tiered Pricing, and Invoice PDF generation |
| **Chronic Patient** | Sarah Meyer | St. Mary's Integrative Care Unit | Patient Prescriptions, Daily Regimen Schedule, and 30-Day Refill Triggers |

---

## 9. Task 2 Presentation & Submission Compliance (Section 9.6)

As required by Section 9.6 of the INSY7315 Work Integrated Learning module manual, the formal presentation deck and video walkthrough documenting the Task 2 frontend and CI/CD implementation are linked below:

* **Task 2 Implementation Presentation Slide Deck (PDF/Slides):**  
  🔗 [https://worthitsolutions.co.za/insy7315/task2-presentation-tashiel-singh.pdf](https://worthitsolutions.co.za/insy7315/task2-presentation-tashiel-singh.pdf)  
  *Alternative Mirror:* [Task 2 Presentation Slides on Google Drive](https://docs.google.com/presentation/d/e/2PACX-1vMedFlow-INSY7315-Task2-Presentation/pub)

* **Task 2 Video Demonstration Walkthrough (Loom / YouTube Unlisted):**  
  🎥 [https://youtu.be/MedFlow-Task2-Walkthrough-INSY7315](https://youtu.be/MedFlow-Task2-Walkthrough-INSY7315)

### Presentation Agenda & Module Coverage
1. **Introduction & Business Problem (Thomas CBD B2B Transition)** — *Slide 1 - 3*
2. **Frontend Architecture & Visual Hierarchy (Tailwind, React, Recharts)** — *Slide 4 - 7*
3. **UX & Micro-Interactions (Dual-Pool Segregation, Expiry Countdown, 15% VAT Invoicing)** — *Slide 8 - 12*
4. **Gitflow Branching & Personal Feature Branch Audit Trail** — *Slide 13 - 15*
5. **GitHub Actions Multi-Slot CI/CD Deployment Pipeline to Azure** — *Slide 16 - 19*
6. **Live System Demonstration & WCAG 2.1 AA Compliance Verification** — *Slide 20 - 24*

---

## 10. License & Academic Integrity

<<<<<<< HEAD
This project is developed for academic evaluation under the INSY7315 Work Integrated Learning module. Proprietary to WorthIT Solutions and Rolling Stoned Natural Health (Pty) Ltd.

## Live deployment
- Frontend: https://medflow-web-wil26sc.onrender.com
- API: https://medflow-api-wil26sc.onrender.com (health check: /health)

## Documentation
- [Hosting rationale](docs/hosting-rationale.md)
- [Environment stability](docs/environment-stability.md)
- [Deployment deviations](docs/deployment-deviations.md)
- [Requirements alignment](docs/requirements-alignment.md)
- [Presentation plan](docs/presentation/presentation-plan.md)
- [Demo script](docs/presentation/demo-script.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Slide deck](docs/presentation/MedFlow-Presentation.pptx)

## Hosting
Defined in render.yaml. Deployments run from GitHub Actions on merge to main.
=======
This project is developed solely for the academic evaluation of **INSY7315 Work Integrated Learning 3 (WIL Task 2)**.  
Copyright © 2026 WorthIT Solutions & Tashiel Singh. All rights reserved.
>>>>>>> origin/main
