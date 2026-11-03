# MedFlow Distribution — Enterprise Edition

### INSY7315 Work Integrated Learning (WIL) — Task 2 Implementation
**Academic Institution:** IIE Emeris University / University Consortium  
**Module:** INSY7315 Work Integrated Learning 3  
**Client Entity:** Thomas — Licensed CBD & Homeopathic Bulk Distributor (Rolling Stoned Natural Health)  
**Enterprise Solution:** Project MedFlow Integrated Distribution Management Platform  
**Lead Engineer (Role 1):** Tashiel Singh (Frontend & DevOps / CI-CD Lead)

---

## 🔑 Stakeholder Logins for Demonstration (7 Roles)

Use any of the following pre-configured credentials to access the platform. All roles share the universal demo password **`password123`**.

| Stakeholder Role | Name & Organization | Email / Username | Password | Landing Page & Key Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Distributor** *(Admin)* | **Thomas**<br>MedFlow Distribution Head | `thomas@medflowdistribution.co.za` | `password123` | **`/dashboard`**<br>• Executive KPIs & Revenue segregation (70% Bulk / 30% Retail)<br>• SARS Section 11(e) wear-and-tear tax depreciation engine<br>• Dual-pool stock transfer & compliance audit trail<br>• Stochastic Growth & Kelly Engine |
| **Pharmacy** *(B2B Client)* | **Sr. Eleanor Scott**<br>MedCentre Health Sandton | `eleanor.scott@medcentre.co.za` | `password123` | **`/orders/new`** & **`/inventory`**<br>• B2B bulk wholesale catalog & stock reserves<br>• Automated wholesale volume discount tiers (10%, 15%, 25%)<br>• Real-time credit facility monitoring (R150,000 limit)<br>• 15% VAT breakdown and order submission |
| **Pharmacist** *(Dispensary)* | **Tariq Moodley**<br>St. Marys Hospital Dispensary | `tariq.moodley@medflowdispensary.co.za` | `password123` | **`/pharmacist-portal`**<br>• HPCSA Reg: PH0284711<br>• Automated 8.5% referral commission tracking card<br>• Patient intake log & referral commission ledger |
| **Doctor** *(Clinical)* | **Dr. Hendrik van der Merwe**<br>Cape Integrative Practice | `dr.hendrik@capewellness.co.za` | `password123` | **`/prescriber-portal`**<br>• HPCSA Reg: MP0492819<br>• Clinical condition tagging (Pain, Anxiety, Insomnia)<br>• Digital prescription issuance & outcome monitoring |
| **Psychiatrist** *(Mental Health)* | **Dr. Marcus Vance**<br>Mind Health Institute | `dr.marcus@mindhealthinstitute.co.za` | `password123` | **`/prescriber-portal`**<br>• HPCSA Reg: MP0821944<br>• Mental health condition tagging (PTSD, Panic, Stress)<br>• Botanical Schedule 4 regimens |
| **Patient** *(Chronic Care)* | **Sarah Meyer**<br>Registered Chronic Patient | `sarah.meyer@wellnessmail.co.za` | `password123` | **`/patient-portal`**<br>• Chronic medical CBD & homeopathic prescriptions<br>• Prescribed dosing schedules & doctor notes<br>• One-click 30-day prescription refill simulation |
| **Leisure Client** *(Wellness)* | **Chloe Bennett**<br>Lifestyle & Wellness Member | `chloe.bennett@lifestylemail.co.za` | `password123` | **`/leisure-portal`**<br>• Lifestyle & wellness botanical retail catalog<br>• Holistic practitioner consultation booking<br>• Personalized natural regimen tracking |

> 💡 **Quick Login Tip:** On the Login page (`/login`), you can click any of the 7 quick-select stakeholder buttons at the top to automatically populate the credentials and test any role instantly.

---

## 🚀 Running the Application Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Frontend Development Server:**
   ```bash
   npm run dev
   ```

3. **Start the Express Backend API (Optional):**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. **Open in Browser:**
   Navigate to [http://localhost:5173](http://localhost:5173) and log in using any credentials from the table above.

---

## 🚀 1-Click Desktop Launcher & Standalone Presentation Package

For presentations and examiner demonstrations, a completely zero-dependency standalone build is available that runs offline with **zero configuration or server setup**:

1. **Launch Directly from Desktop Shortcut:**
   - Double-click the **`MedFlow Demo`** desktop shortcut icon generated on your Windows desktop.
   - Or double-click [`Launch-MedFlow-Demo.bat`](./Launch-MedFlow-Demo.bat) in the project root.
   - Launches in distraction-free Native App Mode (`--app=http://127.0.0.1:4173`) with custom MedFlow branding.

2. **Generate Desktop Icon on Any Machine:**
   - Run [`Create-Desktop-Shortcut.bat`](./Create-Desktop-Shortcut.bat) to instantly place the **`MedFlow Demo`** icon with high-resolution iconography (`medflow.ico`) onto the Windows Desktop.

3. **Portable Offline Transfer Package (`MedFlow-Standalone-Demo.zip`):**
   - Download or transfer [`MedFlow-Standalone-Demo.zip`](./MedFlow-Standalone-Demo.zip) (~310 KB) onto any presentation laptop or USB flash drive.
   - Unzip anywhere and double-click `Launch-MedFlow-Demo.bat`.
   - Requires **no Node.js, no npm, and no database** — automatically boots using the built-in Windows PowerShell HTTP engine if Node is not present.

---

## 🔄 Resetting Demo State

If you submit test orders, transfer stock, or request refills during a presentation, you can restore all mock data back to its pristine default seed state at any time by pressing **`Ctrl + Shift + R`** or clicking the **"Reset Demo State"** button in the top navigation bar.
