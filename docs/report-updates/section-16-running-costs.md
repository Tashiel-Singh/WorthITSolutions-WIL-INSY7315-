# Section 16 update: Running costs, estimate versus actual

| Service | Estimated monthly (Azure plan) | Actual monthly (delivered) |
|---|---|---|
| Web app and API hosting | R200 (App Service B1) | R0 (Render free web service and static site) |
| Database | R250 (PostgreSQL B1ms) | R0 (Render free PostgreSQL, 30-day limit) |
| Object storage | R20 (Blob Storage) | R0 (not deployed) |
| Edge, CDN and WAF | R150 (Front Door) | R0 (not used) |
| Scheduled jobs | R10 (Azure Functions) | R0 (GitHub Actions scheduled workflows) |
| Monitoring | Included | R0 (Render logs, health smoke test) |
| Email | R100 (Communication Services) | R0 (not implemented) |
| CI/CD | Not costed | R0 (GitHub Actions) |
| **Total** | **R730** | **R0** <<confirm on the Render billing page and date it>> |

## Variance
Actual spend is R730 below the estimate because the project ran on free tiers after the Azure subscription was disabled. The saving carries trade-offs: the API sleeps when idle, the free database expires after 30 days, and there is no WAF, private networking, backup retention control or managed secrets store.

## Projected cost to run this properly
<<look up the current Render paid plan prices for a web service and a database on the pricing page, record the date, and convert to rand>>
