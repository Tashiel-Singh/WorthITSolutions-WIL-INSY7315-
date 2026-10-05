# MedFlow Distribution — Standalone Demo Edition (Mock Data)

> **Branch:** `main-dummy`  
> **Notice:** This branch contains the fully self-contained, mock-data-filled version of Project MedFlow. It runs completely offline with zero external database dependencies to guarantee smooth, uninterrupted presentations and grading demonstrations.

---

## 🔑 Dummy Logins for Demonstration

Use any of the following pre-configured credentials to access the platform. All roles share the universal demo password **`password123`**.

| Stakeholder Role | Name & Organization | Email / Username | Password | Landing Page & Key Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Distributor** *(Admin)* | **Thomas**<br>MedFlow Distribution Head | `thomas@medflowdistribution.co.za` | `password123` | **`/dashboard`**<br>• Executive KPIs & Revenue segregation (70% Bulk / 30% Retail)<br>• SARS Section 11(e) wear-and-tear tax depreciation engine<br>• Dual-pool stock transfer & compliance audit trail<br>• Tax invoice generation & client ledger |
| **Pharmacy** *(B2B Client)* | **Sr. Eleanor Scott**<br>MedCentre Health Sandton | `eleanor.scott@medcentre.co.za` | `password123` | **`/inventory`** & **`/orders/new`**<br>• B2B bulk wholesale catalog & stock reserves<br>• Automated wholesale volume discount tiers (10%, 15%, 25%)<br>• Real-time credit facility monitoring (R150,000 limit)<br>• 15% VAT breakdown and order submission |
| **Patient** *(Chronic Care)* | **Sarah Meyer**<br>Registered Chronic Patient | `sarah.meyer@wellnessmail.co.za` | `password123` | **`/patient-portal`**<br>• Chronic medical CBD & homeopathic prescriptions<br>• Prescribed dosing schedules & doctor notes<br>• One-click 30-day prescription refill simulation |

> 💡 **Quick Login Tip:** On the Login page (`/login`), you can click the quick-select stakeholder buttons at the top to automatically populate the credentials and test any role instantly.  
> Alternate test aliases (`owner@medflow.test` for Distributor, `stmarys@medflow.test` for Pharmacy) are also supported.

---

## 🚀 Running the Demo Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   ```bash
   npm run dev
   ```

3. **Open in Browser:**
   Navigate to [http://localhost:5173](http://localhost:5173) and log in using any credentials from the table above.

---

## 🔄 Resetting Demo State

If you submit test orders, transfer stock, or request refills during a presentation, you can restore all mock data back to its pristine default seed state at any time by clicking the **"Reset Data"** button in the top navigation bar.
