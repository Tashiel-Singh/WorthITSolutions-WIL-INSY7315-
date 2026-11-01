\# Role 2 Master Submission: Functional Guide, Backend Architecture \& Refactoring Log



\## 1. Functional User Guide \& Operator Walkthroughs



\### Workflow A: Processing Bulk Pharmacy Orders \& Invoices

1\. Access the \*\*B2B Order Management Portal\*\* and select \*\*Create Bulk Order\*\*.

2\. Input target SKU, base wholesale price, and requested quantity.

3\. The `BulkOrderCalculationService` evaluates volume tiers (15% off for $\\ge 50$ units, 10% for $20-49$ units).

4\. Computes discounted subtotal, applies the statutory \*\*15% South African VAT split\*\*, and generates the invoice JSON.



\### Workflow B: Preventing Inventory Cannibalization

1\. Navigate to the \*\*Inventory Control Dashboard\*\*.

2\. `InventoryService` enforces strict pool isolation (`RETAIL` vs. `BULK\_WHOLESALE`).

3\. Bulk allocations exceeding wholesale reserves trigger a `CannibalizationPreventionException`, protecting B2B contracts.



\### Workflow C: Stochastic Working Capital \& Alpha Engine (`GrowthEngineService`)

1\. Inputs working capital, cash flow volatility ($\\sigma$), expected return drift ($\\mu$), and cycle duration.

2\. Computes the \*\*Kelly Criterion allocation fraction\*\* ($f^\* = \\frac{\\mu - r}{\\sigma^2}$) to size inventory reinvestment safely without liquidity ruin.

3\. Projects compressed cash cycles via logarithmic decay and outputs parametric Monte Carlo 95% confidence intervals.



\---



\## 2. Frequently Asked Questions (FAQ) \& Troubleshooting

\* \*\*Q: Why did an order throw a variance constraint error?\*\*

&#x20; \* \*A:\* Negative cash-flow volatility or invalid capital inputs violate non-arbitrage bounds inside the stochastic quant engine. Ensure floats are positive.

\* \*\*Q: How are tier boundaries handled for bulk orders?\*\*

&#x20; \* \*A:\* Thresholds are inclusive. Exactly 20 units triggers Tier 2 (10% discount).



\---



\## 3. Master Report Updates (Section 8, 10.2, 11 \& Refactoring Log)



\### Tabular Work Breakdown Structure (WBS)

| Task ID | Work Package / Module | Planned Effort | Actual Effort | Status | Deliverable |

| :--- | :--- | :--- | :--- | :--- | :--- |

| \*\*WBS-2.1\*\* | Tax Engine Strategy Pattern | 1 Sprint | 1 Sprint | Completed | `TaxCalculationService.ts` |

| \*\*WBS-2.2\*\* | Formal Tax Deduction Engine | 1 Sprint | 1.5 Sprints | Completed | `FormalTaxDeductionService.ts` |

| \*\*WBS-2.3\*\* | Inventory Pool Segregation | 1 Sprint | 1 Sprint | Completed | `InventoryService.ts` |

| \*\*WBS-2.4\*\* | Stochastic Growth Engine | 1 Sprint | 1 Sprint | Completed | `GrowthEngineService.ts` |

| \*\*WBS-2.5\*\* | Bulk Pricing \& VAT Engine | 1 Sprint | 1 Sprint | Completed | `BulkOrderCalculationService.ts` |



\### Backend Refactoring Log

\* \*\*Sub-Second Execution:\*\* Refactored deterministic calculations to static utility methods, dropping execution latency below $0.10$ seconds.

\* \*\*Stochastic Quant Integration:\*\* Replaced static multipliers with a mean-variance optimized Kelly allocation model to govern working capital velocity.

\* \*\*Precision VAT Splitting:\*\* Fixed rounding drift on fractional currency splits using fixed-precision rounding.

