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

## Order state diagram
```mermaid
stateDiagram-v2
    [*] --> CONFIRMED : POST /api/orders after stock is reserved
    [*] --> PENDING : schema default status
    PENDING --> CONFIRMED
    PENDING --> CANCELLED : owner or owning pharmacy cancels
    CONFIRMED --> PROCESSING : owner updates status
    CONFIRMED --> CANCELLED : stock returned to BULK pool and invoice voided
    PROCESSING --> SHIPPED
    SHIPPED --> DELIVERED
    DELIVERED --> [*]
    CANCELLED --> [*]
```
Cancellation is only allowed from PENDING or CONFIRMED, and is blocked once a payment exists on the invoice.

## Invoice state diagram
```mermaid
stateDiagram-v2
    [*] --> SENT : created with the order
    SENT --> SENT : partial payment recorded
    SENT --> PAID : payments equal invoice total
    SENT --> VOID : order cancelled
    SENT --> OVERDUE : due date passed - reminder job planned, not implemented
    OVERDUE --> PAID : payments equal invoice total
    PAID --> [*]
    VOID --> [*]
```
DRAFT exists in the enum but no code path sets it. OVERDUE is reachable only once the planned reminder job is built.

## Design class diagram (service layer)
```mermaid
classDiagram
    class ITaxStrategy {
        <<interface>>
        +String name
        +calculateCents(input) int
    }
    class DepreciationStrategy {
        -double rate
    }
    class OperatingExpenseStrategy {
        -double rate
    }
    class BulkVatInputStrategy {
        -double rate
    }
    class TaxCalculator {
        -ITaxStrategy strategies
        +calculate(input) TaxResult
    }
    class FormalTaxDeductionService {
        +calculateTotalDeduction(assets, expenses, bulkRevenue) DeductionResult
    }
    class BulkOrderCalculationService {
        +double VAT_RATE
        +discountRateFor(quantity)$ double
        +processBulkOrder(basePrice, quantity) BulkOrderResult
    }
    class RevenueSegregationService {
        +aggregateRevenueByChannel(records) RevenueBreakdown
    }
    class MoneyHelpers {
        <<module>>
        +toCents(amount) int
        +fromCents(cents) double
        +assertMoney(value, label) void
    }
    class OrdersRouter
    class TaxRouter
    class AnalyticsRouter

    ITaxStrategy <|.. DepreciationStrategy
    ITaxStrategy <|.. OperatingExpenseStrategy
    ITaxStrategy <|.. BulkVatInputStrategy
    TaxCalculator o-- ITaxStrategy : delegates to
    FormalTaxDeductionService --> TaxCalculator : uses
    FormalTaxDeductionService ..> MoneyHelpers
    BulkOrderCalculationService ..> MoneyHelpers
    RevenueSegregationService ..> MoneyHelpers
    TaxRouter ..> FormalTaxDeductionService
    OrdersRouter ..> BulkOrderCalculationService
    AnalyticsRouter ..> RevenueSegregationService
```
Rates: depreciation 0.20, operating expenses 0.15, bulk VAT input 0.05. Data entities are defined in backend/prisma/schema.prisma.
