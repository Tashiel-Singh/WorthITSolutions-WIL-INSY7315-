# Section 15 update: DevOps, version control and branching (as practised)

## Branching
Gitflow branches main, staging, develop and feature/*. Promotion commits are visible in history (for example "merge(staging): promote verified develop build", "merge(release): production release"). Exceptions: some deployment fixes and test fixes were committed directly to main because the pipeline was blocking the release. <<state honestly how many>>

## Pipeline
See docs/ci-cd-audit.md. Quality gates: lint, unit tests and production build on every push and pull request.

## Repository metrics
See docs/repository-metrics.md. <<copy the table values in here>>

## Deployment and environment fixes made during the final phase
- Production build output path aligned with the start script.
- JWT secret now mandatory in production (no public fallback).
- Date-dependent unit test made deterministic.
- API body parsing fixed after production verification showed login returning 400.

## Not implemented from the plan
Dependabot scanning: <<present or absent, from the Test-Path check>>. Pre-commit secret scanning: <<present or absent>>. Application Insights and Azure Monitor: replaced by Render logs and the /health smoke test.
