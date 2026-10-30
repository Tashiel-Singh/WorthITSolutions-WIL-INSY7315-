# Backend changelog (Task 2 to EXPO)

## Fixed
- Revenue aggregation threw a TypeError on an unknown channel; it now rejects it with a clear RangeError.
- Currency totals could drift by fractions of a cent; all money maths now uses integer cents.
- Cancelling an order left its invoice live (SENT); the invoice is now VOID, and cancelling after a payment is blocked.
- Payments can no longer be recorded against a voided invoice.
- Order and cancel transactions timed out under slow database connections; timeout extended to 15 seconds.
- Production build wrote dist/src/server.js while npm start expected dist/server.js; build config corrected.
- A hard-coded JWT secret fallback was public in the repository; production now refuses to start without JWT_SECRET.

## Refactored
- Tax deduction engine rebuilt with the Strategy pattern (ITaxStrategy, three strategies, TaxCalculator context) as the design document specifies.
- Shared money helpers (src/lib/money.ts) introduced.

## Logic updates
- Bulk discount tiers aligned between API and storefront: 12+ units 10%, 24+ units 15%, 48+ units 25%.
- VAT is exactly 15% of the discounted subtotal, rounded to the cent.
- New VOID value added to InvoiceStatus (migration 20261030000001).

## Quality
- Jest suites for tax, bulk pricing, revenue, money and security helpers; performance benchmark for the tax engine.
- Coverage scoped to core services with enforced thresholds (record the final table here).
