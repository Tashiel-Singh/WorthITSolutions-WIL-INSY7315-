# Deployment vs design document
| Design document | Delivered | Reason |
|---|---|---|
| Azure App Service | Render web service and static site | Azure for Students subscription disabled (ReadOnlyDisabledSubscription) |
| Azure PostgreSQL Flexible Server | Render Postgres | Same engine, same Prisma schema |
| Azure Blob Storage | Not deployed (see docs/storage.md) | No card-free equivalent verified in time |
| Dev/Staging/Prod slots | Single environment, deploy on merge to main | Cost; free tier |
| Front Door WAF, Key Vault, private endpoints | Render-managed TLS and env vars | Not available on free tier |
Azure provisioning scripts are retained in infra/azure-reference as the design reference.
