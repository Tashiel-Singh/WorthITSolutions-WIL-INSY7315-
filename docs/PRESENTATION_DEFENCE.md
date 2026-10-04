# Role 3 – Technical Defence (Architecture & System Design, 15 marks)

Suggested length: 8–10 minutes + Q&A. One section ≈ one slide.

## 1. Where Role 3 sits (30 s)
Layered architecture (WIL Section 13.2): **React SPA → Express controllers (JWT, validation) → services (Role 2: tax, revenue, bulk) → Prisma repositories → PostgreSQL**. I own the API layer, data layer and security controls. Role 2's services are imported directly by my route wrappers, so business logic is never duplicated in controllers.

## 2. Database design (2 min)
- Physical realisation of the Task 1 ERD: `users`↔`pharmacies` 1:1 (shared PK/FK), `orders→order_items→products`, `invoices.order_id UNIQUE` (DB enforces the 1:1 Order→Invoice rule), `payments` (partial payments), `inventory_items` split by `pool_type` (RETAIL/BULK), `prescribers` with a type discriminator, `prescriptions`.
- Added for the Role 3 brief: `Order`, `Transaction`, `Asset`, `Expense` all carry `channel` (PATIENT/PHARMACY/LEISURE), `bulk_revenue` and `quantity`.
- UUID PKs (safe offline merge, no enumerable IDs). Monetary values are `DECIMAL(12,2)` – never floats.
- Integrity beyond Prisma: migration 2 adds CHECK constraints (no negative stock/prices, positive payments, invoice total ≥ VAT) and an **append-only trigger on `audit_logs`**. FK actions: RESTRICT on financial history, CASCADE only for child rows (order_items, tokens).
- Two migrations: `init` (tables, enums, FKs, indexes) and `constraints_and_audit_immutability`.

## 3. Indexing strategy (1.5 min) – index for the queries we actually run
| Index | Query it serves |
|---|---|
| `orders(pharmacy_id, status)` | Pharmacy's order list / filter by status (ownership scope on every request) |
| `orders(order_date)` | Date-ranged reporting |
| `invoices(status, due_date)` | Overdue detection + payment reminder job (7/3/1 days) |
| `inventory_items(product_id, pool_type)` | Stock check at order time (hot path) |
| `inventory_items(expiry_date)` | Expiry alerts (30/14/7 days) and FEFO picking |
| `transactions(channel, occurred_at)` | Revenue-breakdown endpoint |
| `products(category)`, `products(name)` | Catalog filter/search |
| `prescriptions(patient_id)`, `(prescriber_id)` | Patient profile, prescriber dashboard |
| `audit_logs(entity, entity_id)`, `(user_id, created_at)` | Audit lookups |
| unique: `users.email`, `license_number`, `hpcsa_number`, `refresh_tokens.token_hash` | Login lookup + duplicate prevention |

Trade-off: every index slows writes slightly; justified because reads dominate and write volume is low (a single distributor). Verify with `EXPLAIN ANALYZE`. Targets: p95 < 500 ms reads, < 1.5 s aggregations (NFR).

## 4. API design (2 min)
- REST resources, correct verbs and status codes: 201 on create, 204 on delete/logout, 400 validation, 401 unauthenticated, 403 forbidden, 404 (also used instead of 403 for other tenants' records to prevent ID probing), 409 conflict (insufficient stock, illegal state change), 422 overpayment, 423 locked, 429 rate limit.
- **Input validation with zod on every route**; unknown fields stripped; pagination capped at 100.
- **Order creation is a single DB transaction**: validate products → reserve stock from the BULK pool (earliest expiry first) using a guarded atomic decrement (`WHERE quantity_on_hand >= n`) so two concurrent orders cannot oversell → create order, items, invoice (VAT 15 %, due date from pharmacy credit terms) and a revenue `Transaction`. Any failure rolls everything back. This is the "cannibalisation prevention" rule implemented at the data level.
- Order status follows the state diagram (Pending→Confirmed→Processing→Shipped→Delivered; cancel only before Processing).
- The three required wrappers: `GET /analytics/revenue-breakdown`, `POST /tax/calculate-deduction`, `POST /orders/bulk-process`.

## 5. Security controls (2.5 min) – map to OWASP Top 10
| Control | Implementation | Threat |
|---|---|---|
| Password hashing | bcrypt cost 12; policy ≥10 chars + upper/lower/digit | Credential theft |
| Tokens | 15-min HS256 JWT (algorithm pinned → blocks `alg:none`); 7-day opaque refresh token, **stored only as SHA-256**, rotated on use, revocable | Token replay |
| RBAC | `authenticate` + `requireRole()` middleware on every router; 7 roles | Broken access control |
| IDOR | Queries scoped to the caller (`pharmacyId = token.sub`); other tenants get 404 | Broken access control |
| SQL injection | Prisma parameterised queries only; no raw-SQL helpers (a unit test fails the build if they appear) | Injection |
| Brute force | Login rate limit, lockout after 5 failures for 15 min, identical error for bad email/password, dummy hash compare for timing equalisation | Auth failures |
| Transport/headers | Helmet, CORS allow-list, TLS 1.2+ at Azure Front Door, 100 kb body limit | Misconfiguration |
| Secrets | `.env` git-ignored; Key Vault in Azure; startup fails if `JWT_SECRET` < 32 chars | Secret leakage |
| Errors | Central handler; stack traces never returned | Info disclosure |
| Audit | Append-only `audit_logs` (who/what/when/IP), DB trigger blocks UPDATE/DELETE | Repudiation |
| Least privilege | App DB user without DDL rights (WIL §14.2) | Blast radius |

## 6. POPIA compliance workflow (1.5 min)
1. **Consent**: registration requires explicit `DATA_STORAGE` consent; reminder consent is separate and optional; every grant/withdrawal is a timestamped row in `consent_records` (`POST /patients/consent`).
2. **Minimisation**: leisure clients have no patient/prescription record; role-based field hiding (e.g. pharmacy cannot see prescriptions; bulk price hidden from patients).
3. **Right of access**: `GET /patients/:id/export` returns patient data, prescriptions and consent history (OWNER or the patient only).
4. **Right to erasure**: `POST /patients/:id/anonymise` scrubs name, DOB, contact, replaces the login email and revokes sessions. Prescriptions/financial rows are retained (legal record-keeping) but are no longer linkable to a person.
5. **Accountability**: all of the above are audit-logged; encryption at rest (AES-256) and in transit (TLS).

## 7. Likely questions
- *Why Prisma, not raw SQL?* Type-safe, parameterised by default, migrations in source control; raw SQL remains possible via `$queryRaw` tagged templates if ever needed.
- *Why soft delete for users/products?* Orders, invoices and audit rows reference them; hard deletes would break financial history (RESTRICT FKs).
- *Why a refresh token table if JWTs are stateless?* Short JWTs limit exposure; revocable refresh tokens give logout and account deactivation without a shared session store.
- *How do you stop overselling under concurrency?* Guarded atomic UPDATE inside a transaction; a failed guard returns 409 and rolls back.
- *Why is anonymisation not deletion?* POPIA allows retention where another law requires records; anonymisation removes identifiability.
- *What would you do next?* Row-level security in Postgres, refresh-token reuse detection, Redis-backed rate limits, `EXPLAIN` benchmarks at 10 k patients.
