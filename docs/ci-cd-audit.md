# CI/CD audit (deploy.yml and related workflows)

Pipeline: .github/workflows/deploy.yml, "MedFlow Enterprise CI/CD Pipeline".
Triggers: push and pull request on main, staging and develop, plus manual dispatch. Concurrency group cancels superseded runs.

| Stage | What it does | Evidence |
|---|---|---|
| Build and test | Node 20, npm ci, lint (tsc --noEmit), Vitest (test:ci), production build, archive of dist | <<run link and job status>> |
| Azure App Service job | Slot deploys for develop, staging and main. Skips automatically because no publish-profile secrets exist (Azure subscription disabled) | <<job shows skipped>> |
| Render hook | Posts to the Render deploy hook on a main push | <<step log>> |
| GitHub Pages | Publishes the SPA with an SPA 404 fallback | <<pages URL loads>> |

Related workflows: pr-verify.yml (quality gate on pull requests), deploy-api.yml and deploy-web.yml (Render hooks), smoke-test.yml (post-deploy /health), keep-alive.yml (scheduled ping during demo week).

## Run history
Full list: docs/ci-run-history.csv (last 30 runs). Summary: <<success / failure counts>>.

## Failures found and fixed during the project
- Render deploy hook returned "could not resolve host": the stored secret was not a valid URL; replaced with a fresh hook.
- Expiry-countdown unit test depended on the real calendar date and failed once November approached; fixed by freezing the date in the test (commit e0024ae).
- Production build wrote dist/src/server.js while npm start expected dist/server.js; build config corrected (commit 0848a37).

## Result of the final release merge
<<run link, all jobs green, date>>
