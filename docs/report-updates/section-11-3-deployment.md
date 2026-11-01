# Section 11.3 update: Deployment Plan (as built)

The original plan used three Azure environments with blue/green slot swaps. The Azure for Students subscription was disabled (ReadOnlyDisabledSubscription), so production was deployed to Render. The Azure slot workflow remains in deploy.yml and skips itself without publish-profile secrets.

| Environment | Purpose | Infrastructure | Data |
|---|---|---|---|
| Local development | Feature work and tests | Vite dev server, Node API, local database | Seeded test data |
| Production | Live system for the EXPO | Render web service (Node 20, free plan, health check /health), Render static site, Render PostgreSQL (free plan) | Seeded demo data |
| Public mirror | Public copy of the SPA | GitHub Pages, calls the production API | None |
| Dev and Staging slots | Planned | Not provisioned (Azure unavailable) | Not applicable |

## Release workflow as implemented
1. Feature branch, pull request, merge into develop, then staging, then main (Gitflow).
2. A push to main runs deploy.yml: install, lint, Vitest, production build, then the Render web hook and the GitHub Pages publish.
3. deploy-api.yml posts to the API deploy hook. Render builds (npm ci, prisma generate, build), then the start command runs prisma migrate deploy before the server starts.
4. smoke-test.yml polls /health after the API deploy.

## Slot swap versus what was delivered
The design relied on Azure deployment slots for zero-downtime swaps and instant rollback. Render has no slot concept. Rollback is a redeploy of an earlier commit from the service's deploy history. <<confirm in the Render dashboard and state what you observed>>

## Configuration
Environment variables on the API service: DATABASE_URL (from the managed database), JWT_SECRET, JWT_ACCESS_EXPIRES (15m), CORS_ORIGIN. TLS certificates are issued and renewed by the platform. Blueprint: render.yaml.

## Known limits
The free plan sleeps after inactivity and a cold request can take about a minute. The free database expires <<date>>. Plan: <<upgrade or recreate before the EXPO>>.
