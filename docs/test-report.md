# Backend test report (Role 2)

Command: npm test -- --coverage (in /backend). Jest 29 with ts-jest.

| Metric | Result |
|---|---|
| Test suites | 7 passed |
| Tests | 39 passed |
| Statements | 100% |
| Branches | 92.59% |
| Functions | 100% |
| Lines | 100% |

Coverage scope: src/services/**, src/lib/money.ts and src/lib/security.ts (core business services and security helpers). Thresholds enforced in jest.config.js: statements 80, branches 70, functions 80, lines 80.

## Before and after
Baseline before the refactor: 71.17% statements and 45.16% branches, measured over every file the tests imported (including config and middleware) while the three services were placeholders. The coverage scope was narrowed afterwards, so the two figures are not like-for-like.

## Performance
Tax deduction engine, 400,000 line items (200,000 assets plus 200,000 expenses): 273.6 ms to 318.9 ms across three runs on a development laptop. Target is under 1,000 ms. The test fails if it is exceeded.

## Not covered by unit tests
Express routes and middleware (auth.ts, errors.ts) need a database. They are exercised through the REST client file docs/api-tests.http and the live demo.
