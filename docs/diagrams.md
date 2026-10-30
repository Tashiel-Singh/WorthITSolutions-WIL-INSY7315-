# Production diagrams (generated from the implemented code)

## Place Bulk Order (POST /api/orders)
```mermaid
sequenceDiagram
    autonumber
    actor PM as Pharmacy Manager
    participant SPA as React SPA
    participant API as Express orders router
    participant MW as authenticate, requireRole, zod validate
    participant CALC as BulkOrderCalculationService
    participant DB as PostgreSQL via Prisma

    PM->>SPA: Select products and quantities
    SPA->>API: POST /api/orders with Bearer JWT
    API->>MW: Verify 15 minute JWT, check role, validate body
    MW-->>API: req.user and validated items
    API->>DB: BEGIN transaction, 15 s timeout
    DB-->>API: Pharmacy and active products
    loop For each product
        API->>DB: Select BULK pool rows, unexpired, earliest expiry first
        API->>DB: Guarded decrement where quantityOnHand >= take
        alt Stock insufficient or changed concurrently
            DB-->>API: Update count 0 or remaining above 0
            API-->>SPA: 409 Conflict, transaction rolls back
        end
        API->>CALC: processBulkOrder(bulkPrice, quantity)
        CALC-->>API: Tier discount and 15 percent VAT figures
    end
    API->>DB: Insert order CONFIRMED with items
    API->>DB: Insert invoice, VAT 15 percent, due date from credit terms, status SENT
    API->>DB: Insert transaction ledger row
    DB-->>API: COMMIT
    API->>DB: Write audit log entry
    API-->>SPA: 201 Created with order and invoice
    SPA-->>PM: Show order confirmation and invoice
```

Difference from the design document: the invoice is created inside the same database transaction as the order (atomic), instead of in a separate decoupled invoice service.
