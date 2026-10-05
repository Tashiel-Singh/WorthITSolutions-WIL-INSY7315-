# MedFlow – Role 3: Data Architecture, API & Security

## Role 3 Overview

Role 3 is responsible for the **Data Architecture, REST API layer, database integration, authentication, authorisation, security controls, audit logging, patient privacy functionality, and backend service integration** for the MedFlow system.

The implementation uses:

* **Node.js**
* **Express**
* **TypeScript**
* **PostgreSQL**
* **Prisma ORM**
* **JWT authentication**
* **bcrypt password hashing**
* **Zod request validation**
* **Role-Based Access Control (RBAC)**
* **Audit logging**
* **Jest**
* **Supertest**

The implementation supports the Task 1 ERD and provides the backend foundation required for the MedFlow pharmacy-management platform.

---

# 1. Role 3 Objectives

The primary objectives of Role 3 were to:

1. Implement the MedFlow relational database using PostgreSQL and Prisma.
2. Implement the REST API layer using Node.js, Express and TypeScript.
3. Implement authentication and authorisation.
4. Enforce Role-Based Access Control.
5. Protect sensitive data using ownership and access checks.
6. Implement patient privacy and POPIA-related functionality.
7. Implement product and inventory management.
8. Implement bulk ordering and stock reservation.
9. Implement order lifecycle management.
10. Implement B2B invoicing and payment processing.
11. Integrate Role 2 financial and calculation services.
12. Implement revenue analytics and tax-deduction functionality.
13. Implement audit logging.
14. Implement automated backend security and service tests.
15. Provide a secure, maintainable backend architecture for the remaining project roles.

---

# 2. Technology Stack

| Layer                   | Technology                                        |
| ----------------------- | ------------------------------------------------- |
| Runtime                 | Node.js                                           |
| Framework               | Express 4                                         |
| Language                | TypeScript                                        |
| Database                | PostgreSQL 18                                     |
| ORM                     | Prisma 5.22                                       |
| Authentication          | JWT                                               |
| Password Security       | bcrypt                                            |
| Validation              | Zod                                               |
| Testing                 | Jest + Supertest                                  |
| API                     | REST                                              |
| Development             | PowerShell / VS Code                              |
| Database Administration | Prisma Studio / PostgreSQL                        |
| Security                | RBAC, ownership checks, validation, audit logging |

---

# 3. Setup

The backend can be installed and executed using the following commands:

```bash
npm install

cp .env.example .env
# Set DATABASE_URL and a 64+ character JWT_SECRET

npx prisma generate

npx prisma migrate deploy

npm run seed

npm run dev

npm test
```

The development API runs on:

```text
http://localhost:4000
```

Health endpoint:

```text
GET /health
```

Expected response:

```json
{
  "status": "ok"
}
```

### Seed Accounts

The development seed creates:

| Role             | Email                                               | Password        |
| ---------------- | --------------------------------------------------- | --------------- |
| OWNER            | [owner@medflow.test](mailto:owner@medflow.test)     | OwnerPass123    |
| PHARMACY_MANAGER | [stmarys@medflow.test](mailto:stmarys@medflow.test) | PharmacyPass123 |

The seed also creates the initial pharmacy and products required for testing.

### Production Database Security

A **least-privilege database account** should be used by the runtime application in production.

The runtime database user should not have unnecessary permissions such as:

* `DROP`
* `ALTER`
* Schema-management privileges

Database migrations should instead be executed using a separate administrative/migration account.

---

# 4. Database Architecture

The MedFlow backend uses PostgreSQL through Prisma ORM.

The database contains the following primary tables:

* `users`
* `patients`
* `pharmacies`
* `prescribers`
* `prescriptions`
* `products`
* `inventory_items`
* `orders`
* `order_items`
* `invoices`
* `payments`
* `transactions`
* `assets`
* `expenses`
* `consent_records`
* `audit_logs`
* `refresh_tokens`

Two Prisma migrations are included:

```text
20261004000001_init
20261004000002_constraints_and_audit_immutability
```

The second migration strengthens database integrity and audit-log immutability.

---

# 5. Backend Architecture

The backend follows a layered architecture:

```text
Client
   │
   ▼
Express Application
   │
   ├── Authentication Middleware
   ├── Role-Based Access Control
   ├── Validation Middleware
   ├── Error Handling Middleware
   │
   ▼
REST Routes
   │
   ├── Auth
   ├── Users
   ├── Patients
   ├── Products
   ├── Orders
   ├── Invoices
   ├── Analytics
   └── Tax
   │
   ▼
Services
   │
   ├── BulkOrderCalculationService
   ├── RevenueSegregationService
   └── FormalTaxDeductionService
   │
   ▼
Prisma ORM
   │
   ▼
PostgreSQL
```

This separation allows business logic, security, API routing and database access to remain maintainable.

---

# 6. Where Role 2 Plugs In

The `src/services/` directory contains the financial and calculation services used by the backend:

* `RevenueSegregationService`
* `FormalTaxDeductionService`
* `BulkOrderCalculationService`

These services integrate directly with:

```text
src/routes/analytics.ts
src/routes/tax.ts
src/routes/orders.ts
```

The service boundaries allow Role 2's implementation to be integrated without restructuring the entire API.

The important service methods are:

```text
RevenueSegregationService.aggregateRevenueByChannel()
FormalTaxDeductionService.calculateTotalDeduction()
BulkOrderCalculationService.processBulkOrder()
```

Where Role 2's final implementations use compatible method signatures, the existing route integration can be retained. If signatures differ, only the corresponding service call in the relevant route needs adjustment.

---

# 7. REST API Endpoints

| Method    | Path                               | Roles                   | Notes                                                              |
| --------- | ---------------------------------- | ----------------------- | ------------------------------------------------------------------ |
| POST      | `/api/auth/register`               | Public                  | Patient/leisure registration with POPIA consent                    |
| POST      | `/api/auth/login`                  | Public                  | bcrypt verification, lockout after 5 failures, JWT + refresh token |
| POST      | `/api/auth/refresh`                | Public                  | Refresh-token rotation                                             |
| POST      | `/api/auth/logout`                 | Authenticated           | Revokes refresh token                                              |
| GET/POST  | `/api/users`                       | OWNER                   | List/create users                                                  |
| GET       | `/api/users/me`                    | Any authenticated user  | Current user                                                       |
| GET       | `/api/users/:id`                   | Self / OWNER            | User lookup                                                        |
| PATCH     | `/api/users/:id`                   | OWNER                   | Role/status/password administration                                |
| DELETE    | `/api/users/:id`                   | OWNER                   | Deactivates account                                                |
| GET       | `/api/products`                    | Authenticated           | Product listing/search/filter                                      |
| GET       | `/api/products/:id`                | Authenticated           | Product details                                                    |
| POST      | `/api/products`                    | OWNER                   | Create product                                                     |
| PUT/PATCH | `/api/products/:id`                | OWNER                   | Update product                                                     |
| DELETE    | `/api/products/:id`                | OWNER                   | Soft delete                                                        |
| POST      | `/api/orders`                      | OWNER, PHARMACY_MANAGER | Atomic order creation                                              |
| GET       | `/api/orders`                      | OWNER, PHARMACY_MANAGER | Pharmacy-scoped listing                                            |
| GET       | `/api/orders/:id`                  | OWNER, PHARMACY_MANAGER | Ownership-scoped lookup                                            |
| PATCH     | `/api/orders/:id/status`           | OWNER                   | Validated lifecycle transition                                     |
| POST      | `/api/orders/:id/cancel`           | OWNER, owning pharmacy  | Cancel PENDING/CONFIRMED order                                     |
| POST      | `/api/orders/bulk-process`         | OWNER, PHARMACY_MANAGER | Bulk order calculation                                             |
| GET       | `/api/invoices`                    | OWNER, PHARMACY_MANAGER | Scoped invoice listing                                             |
| GET       | `/api/invoices/:id`                | OWNER, PHARMACY_MANAGER | Invoice details                                                    |
| POST      | `/api/invoices/:id/payments`       | OWNER                   | Partial/full payment                                               |
| GET       | `/api/analytics/revenue-breakdown` | OWNER                   | Revenue segregation                                                |
| POST      | `/api/tax/calculate-deduction`     | OWNER                   | Tax deduction calculation                                          |
| POST      | `/api/patients/consent`            | Authenticated           | POPIA consent logging                                              |
| GET       | `/api/patients/:id/export`         | OWNER / Self            | Patient data export                                                |
| GET       | `/api/patients/me/export`          | Self                    | Current patient's data export                                      |
| POST      | `/api/patients/:id/anonymise`      | OWNER                   | Patient anonymisation                                              |

### HTTP Status Codes

The API uses appropriate HTTP status codes including:

```text
200  Success
201  Created
204  No Content
400  Validation Error
401  Unauthenticated
403  Forbidden
404  Resource Not Found
409  Conflict
422  Unprocessable Entity
423  Account Locked
429  Rate Limited
500  Internal Server Error
```

---

# 8. Authentication and Security

Authentication uses JWT access tokens and refresh tokens.

The login flow is:

```text
User
 │
 ▼
POST /api/auth/login
 │
 ▼
bcrypt password verification
 │
 ▼
JWT access token
 │
 ├── 15-minute expiry
 │
 ▼
Refresh token
 │
 ▼
Authenticated API requests
```

Security controls include:

* bcrypt password hashing
* JWT authentication
* short-lived access tokens
* refresh-token rotation
* refresh-token revocation
* account lockout
* request validation
* role-based authorisation
* ownership checks
* audit logging
* database constraints
* transaction-safe operations

Sensitive user fields such as password hashes are not returned by the Users API.

---

# 9. Role-Based Access Control

The backend implements the primary MedFlow roles:

* `OWNER`
* `PHARMACY_MANAGER`
* `PATIENT`
* `LEISURE_CLIENT`

Examples:

### OWNER

Can:

* manage users
* manage products
* view all pharmacies' orders
* manage order status
* process invoices and payments
* access analytics
* perform tax calculations
* anonymise patient records

### PHARMACY_MANAGER

Can:

* view their pharmacy's products
* create orders
* view their own pharmacy's orders
* cancel eligible orders
* perform bulk calculations

They cannot:

* access another pharmacy's orders
* access owner-only analytics
* perform owner-only invoice payments
* manage system users

### PATIENT

Can:

* access their own profile
* manage consent
* export their own data

They cannot:

* access administrative APIs
* access bulk pricing
* access other users
* access other pharmacies' data

---

# 10. Patient Privacy and POPIA

Patient data functionality was implemented with privacy and access control in mind.

The backend supports:

### Consent

```text
POST /api/patients/consent
```

Consent actions are recorded for auditability.

### Right of Access

```text
GET /api/patients/me/export
GET /api/patients/:id/export
```

The `/me/export` endpoint directly performs the export instead of relying on an HTTP redirect, preventing authentication headers from being lost during PowerShell/API testing.

### Right to Erasure

```text
POST /api/patients/:id/anonymise
```

Anonymisation is restricted to the OWNER role.

---

# 11. Product Management

The Products API provides:

* product creation
* product retrieval
* search
* category filtering
* pagination
* updates
* soft deletion
* role-controlled bulk pricing

Bulk prices are hidden from PATIENT and other unauthorised users.

For example, searching:

```text
GET /api/products?search=CBD
```

returned only the relevant CBD products and did not expose their bulk prices to a patient account.

Product deletion uses a **soft-delete** approach rather than physically removing historical product records.

---

# 12. Bulk Ordering and Inventory

The order system supports B2B pharmacy bulk purchasing.

Example:

```text
POST /api/orders/bulk-process
```

with:

```json
{
  "basePrice": 330,
  "quantity": 10
}
```

produced:

```text
Gross:           R3,300
Discount:        R0
Subtotal:        R3,300
VAT (15%):       R495
Total:           R3,795
```

The actual order workflow performs:

1. Product validation.
2. Pharmacy validation.
3. Stock validation.
4. BULK inventory reservation.
5. Order creation.
6. Order-item creation.
7. Invoice creation.
8. Transaction creation.
9. Audit logging.

These operations are performed atomically to prevent inconsistent financial or inventory states.

---

# 13. Inventory Integrity

MedFlow separates:

```text
BULK inventory
RETAIL inventory
```

Bulk pharmacy orders consume BULK inventory only.

Stock deductions use guarded atomic updates to prevent stock from becoming negative.

The implementation also considers product expiry using **FEFO — First Expiry, First Out**.

A cancellation returns the reserved quantity to the BULK inventory pool.

During testing:

```text
Initial CBD Capsules BULK stock: 500
Order quantity:                    5
Stock after order:                495
Stock after cancellation:         500
```

This confirmed that cancellation restores the reserved quantity.

---

# 14. Order Lifecycle

Orders use a controlled state machine:

```text
PENDING
   │
   ├── CONFIRMED
   │      │
   │      ├── PROCESSING
   │      │      │
   │      │      └── SHIPPED
   │      │             │
   │      │             └── DELIVERED
   │      │
   │      └── CANCELLED
   │
   └── CANCELLED
```

Valid transitions are enforced by the API.

During testing:

```text
CONFIRMED
    ↓
PROCESSING
    ↓
SHIPPED
    ↓
DELIVERED
```

worked successfully.

An invalid transition such as:

```text
DELIVERED → PROCESSING
```

was rejected with:

```text
409 Conflict
```

---

# 15. Invoicing and Payments

Invoices are automatically generated as part of order creation.

For the tested 10-unit CBD Oil order:

```text
Bulk Revenue:    R3,300
VAT:             R495
Invoice Total:   R3,795
```

The payment API supports partial payments.

Example:

```text
Payment 1: R1,000
Payment 2: R2,795
-----------------
Total:     R3,795
```

The invoice automatically changed to:

```text
PAID
```

after the outstanding balance was settled.

Overpayment protection was also tested.

Attempting to pay R2,000 against an invoice with an outstanding balance of R1,581.25 returned:

```text
422 Unprocessable Entity
```

with:

```text
Payment exceeds outstanding balance
```

Payments on an already-paid invoice are also rejected.

---

# 16. Revenue Segregation and Analytics

The analytics endpoint is:

```text
GET /api/analytics/revenue-breakdown
```

It is restricted to OWNER users.

The endpoint integrates:

```text
RevenueSegregationService.aggregateRevenueByChannel()
```

Test results for the 10-unit pharmacy order:

```text
Record Count:       1
PHARMACY Revenue:   R3,300
Bulk Revenue:       R3,300
Units:              10
Retail Revenue:     R0
Patient Revenue:    R0
Leisure Revenue:    R0
```

Date filtering was also tested successfully.

Invalid date input was correctly rejected through Zod validation.

---

# 17. Tax Deduction Engine

The tax endpoint is:

```text
POST /api/tax/calculate-deduction
```

It integrates:

```text
FormalTaxDeductionService.calculateTotalDeduction()
```

The tested calculation used:

```text
Depreciable asset: R10,000
Non-depreciable asset: R5,000
Expense: R2,000
Bulk revenue: R20,000
```

The resulting deductions were:

```text
Depreciation deduction: R2,000
Expense deduction:      R300
VAT input deduction:    R1,000
Total deduction:        R3,300
```

Negative values were rejected by input validation.

The endpoint can also retrieve assets, expenses and bulk revenue from the database when those values are not explicitly supplied.

---

# 18. User Administration

The Users API supports OWNER-controlled administration.

Functions include:

* list users
* retrieve own profile
* retrieve users by ID
* create users
* change roles
* activate/deactivate accounts
* change passwords
* revoke refresh tokens
* prevent OWNER self-deactivation

A temporary test user was created, deactivated and verified.

After deactivation, attempting to log in returned:

```text
Invalid email or password
```

This confirmed that inactive accounts cannot authenticate.

---

# 19. Audit Logging

Security-sensitive and business-sensitive operations generate audit records.

Examples include:

* authentication events
* patient consent
* patient data access
* anonymisation
* product changes
* order creation
* order cancellation
* invoice payments
* tax calculations
* user administration

Audit records provide traceability for administrative and compliance purposes.

Database-level protections were also introduced to strengthen audit-log immutability.

---

# 20. The Enterprise Pivot: Problem, Solution & Impact

| Enterprise Problem                                  | Role 3 Solution                                   | Demonstrated Impact                                                |
| --------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------ |
| Financial calculations needed to be consistent      | Integrated `BulkOrderCalculationService`          | 10-unit order calculated R3,300 revenue, R495 VAT and R3,795 total |
| Bulk and retail revenue needed separation           | `RevenueSegregationService`                       | PHARMACY/BULK revenue correctly separated from other channels      |
| Inventory could become inconsistent during ordering | Atomic stock reservation and transaction handling | 10-unit order reserved BULK stock correctly                        |
| Cancelled orders could leave stock incorrect        | Cancellation restores BULK inventory              | 5-unit cancellation restored stock from 495 to 500                 |
| Orders needed controlled fulfilment                 | Order state machine                               | CONFIRMED → PROCESSING → SHIPPED → DELIVERED worked                |
| Invalid order transitions create operational risk   | Transition validation                             | DELIVERED → PROCESSING rejected with HTTP 409                      |
| Customers could overpay invoices                    | Outstanding-balance validation                    | R2,000 overpayment rejected with HTTP 422                          |
| Large invoices may require staged settlement        | Partial payment support                           | R1,000 + R2,795 successfully settled R3,795                        |
| Pharmacy data could be exposed across organisations | Pharmacy ownership scoping                        | Cross-pharmacy access returned HTTP 404                            |
| Sensitive bulk pricing should not be exposed        | Role-controlled product presentation              | PATIENT responses excluded `bulkPrice`                             |
| Patient information requires privacy controls       | POPIA consent/export/anonymisation                | Consent and data-access functionality implemented                  |
| Unauthorised administrative access                  | JWT + RBAC                                        | PATIENT access to owner-only endpoints rejected with HTTP 403      |
| Inactive accounts could pose security risks         | Account deactivation + refresh-token revocation   | Deactivated account authentication was rejected                    |
| Tax calculations need validation                    | Formal tax deduction service + Zod                | Negative inputs rejected and deduction calculation verified        |
| Backend quality needs repeatable verification       | Jest/Supertest security and service tests         | 12/12 automated tests passed                                       |

---

# 21. Security Testing

Security testing specifically covered:

### Authentication

* valid login
* invalid login
* JWT authentication
* refresh-token behaviour
* deactivated-account protection

### Authorisation

* OWNER-only endpoints
* PHARMACY_MANAGER restrictions
* PATIENT restrictions
* ownership checks

### IDOR Protection

A second pharmacy manager attempted to access another pharmacy's order.

The API returned:

```text
404 Order not found
```

The same ownership protection was confirmed for invoices.

### Bulk Price Protection

PATIENT users did not receive `bulkPrice`.

### Payment Protection

Overpayment attempts were rejected.

Already-paid invoices could not receive additional payments.

### State-Machine Protection

Invalid order transitions were rejected.

---

# 22. Automated Testing

The automated test suite was executed using:

```powershell
npm test
```

Result:

```text
PASS  src/tests/services.test.ts
PASS  src/tests/security.test.ts

Test Suites: 2 passed, 2 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        5.76 s
```

Therefore:

```text
2/2 test suites passed
12/12 tests passed
```

The only output requiring attention was a `ts-jest` deprecation warning concerning the `isolatedModules` configuration. It did not cause a test failure.

---

# 23. API Verification

The backend was also tested manually against the live local PostgreSQL database.

Verified functionality included:

* authentication
* patient registration
* POPIA consent
* patient data export
* product CRUD
* product search
* bulk price protection
* bulk order calculation
* order creation
* inventory reservation
* order retrieval
* pharmacy ownership
* order lifecycle
* order cancellation
* inventory restoration
* invoice creation
* invoice retrieval
* partial payments
* full invoice settlement
* overpayment protection
* user administration
* user deactivation
* revenue analytics
* date filtering
* tax calculations
* input validation

---

# 24. Database Integrity and Transaction Safety

The order process uses database transactions to keep related entities consistent.

The following entities are created together during order processing:

```text
Order
 ├── Order Items
 ├── Invoice
 └── Transaction
```

Inventory reservation is also guarded to prevent negative stock.

This reduces the risk of scenarios such as:

```text
Order created
but stock not deducted
```

or:

```text
Stock deducted
but invoice not created
```

The database therefore acts as a consistency boundary for core financial and inventory operations.

---

# 25. Environment and Secrets

Sensitive configuration is stored in `.env` and excluded from version control.

The repository contains:

```text
.env.example
```

rather than the real environment secrets.

Important environment variables include:

```text
DATABASE_URL
JWT_SECRET
JWT_ACCESS_EXPIRES
REFRESH_TOKEN_DAYS
BCRYPT_COST
PORT
CORS_ORIGIN
```

The real database password and JWT secret must never be committed to GitHub.

---

# 26. Known Gaps and Honest Project Notes

The following points should be explicitly documented rather than overstating the implementation.

### Database Migration Verification

The migration SQL was written to correspond to `schema.prisma`.

The final implementation was subsequently executed against a live PostgreSQL 18 database and the migrations were successfully deployed.

The database was verified to contain the expected MedFlow tables and the API was successfully tested against PostgreSQL.

For an independent environment, migration/schema consistency can additionally be checked with:

```bash
npx prisma migrate diff \
  --from-migrations prisma/migrations \
  --to-schema-datamodel prisma/schema.prisma \
  --shadow-database-url <url>
```

The expected result is that no unintended schema differences are reported.

### Invoice Email Sending

Email delivery of invoices is **not part of Role 3**.

This functionality belongs to the relevant Sprint 4 frontend/backend task.

Role 3 provides the invoice data and payment APIs required by the system.

### Cancellation Inventory Behaviour

When an order is cancelled, the quantity is returned to the BULK inventory pool.

The current implementation returns the quantity to the **earliest-expiry applicable BULK inventory row**, rather than reconstructing the exact original inventory batch from which the reservation was made.

This is an intentional documented limitation of the current implementation.

### Automated Test Warning

The test suite currently reports a `ts-jest` deprecation warning regarding the `isolatedModules` configuration.

This warning does not affect test execution:

```text
12/12 tests passed
```

---

# 27. Role 3 Deliverables

The completed Role 3 implementation provides:

* PostgreSQL database
* Prisma ORM integration
* Prisma migrations
* Database constraints
* Seed data
* JWT authentication
* bcrypt password security
* refresh-token management
* RBAC
* ownership checks
* patient APIs
* POPIA functionality
* product management
* bulk ordering
* inventory management
* FEFO stock handling
* order lifecycle management
* order cancellation
* invoice management
* partial payments
* payment validation
* revenue analytics
* tax deduction calculations
* user administration
* audit logging
* security middleware
* validation middleware
* error handling
* automated security tests
* automated service tests
* API documentation
* Role 2 service integration

---

# 28. Quantified Demonstration Results

| Test                           | Result       |
| ------------------------------ | ------------ |
| Bulk order quantity            | 10 units     |
| Bulk unit price                | R330         |
| Bulk revenue                   | R3,300       |
| VAT at 15%                     | R495         |
| Invoice total                  | R3,795       |
| First payment                  | R1,000       |
| Second payment                 | R2,795       |
| Final invoice status           | PAID         |
| Cancellation test quantity     | 5 units      |
| Cancellation stock restoration | 495 → 500    |
| Overpayment attempt            | Rejected     |
| Invalid state transition       | Rejected     |
| Cross-pharmacy order access    | Rejected     |
| Cross-pharmacy invoice access  | Rejected     |
| Automated test suites          | 2/2 passed   |
| Automated tests                | 12/12 passed |

---

# 29. Final Role 3 Assessment

Role 3 establishes the secure backend foundation of MedFlow.

The implementation connects the relational database, REST APIs, business services and security layer into a single operational system. The backend demonstrates transactional order processing, inventory protection, controlled financial operations, role-based access, patient privacy functionality and auditability.

Most importantly, the implementation was not only compiled but **tested against a live PostgreSQL database**, with the major API workflows and security controls verified.

The final architecture provides a clear integration point for the remaining project roles while maintaining separation between:

```text
Data
 ↓
API
 ↓
Security
 ↓
Business Services
 ↓
Frontend
```

The implementation therefore fulfils the core responsibilities of:

**Data Architecture + REST API + Security + Backend Integration for Role 3.**
