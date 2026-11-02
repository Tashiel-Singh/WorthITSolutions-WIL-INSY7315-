# Production verification

Run: 2026-11-02 13:57 (local time)  
Commit: 5f59b5d  
Web: https://medflow-web-wil26sc.onrender.com  
API: https://medflow-api-wil26sc.onrender.com  
Pages mirror: https://tashiel-singh.github.io/WorthITSolutions-WIL-INSY7315-/

| Check | Result | Detail |
|---|---|---|
| Web app (Render static site) | PASS | HTTP 200 in 873 ms (first request, may include a cold start) |
| GitHub Pages mirror | PASS | HTTP 200 in 731 ms (first request, may include a cold start) |
| API /health | PASS | HTTP 200 in 695 ms (first request, may include a cold start) |
| TLS certificate medflow-web-wil26sc.onrender.com | PASS | Tls13, trusted chain, expires 2026-12-21 (48 days left) |
| TLS certificate medflow-api-wil26sc.onrender.com | PASS | Tls13, trusted chain, expires 2026-12-21 (48 days left) |
| HTTP redirects to HTTPS (web) | PASS | https://medflow-web-wil26sc.onrender.com/ |
| CORS allows the web origin | PASS | Access-Control-Allow-Origin: https://medflow-web-wil26sc.onrender.com |
| API latency, 5 warm requests | FAIL | min 404 / avg 559 / max 1009 ms (design target: reads under 500 ms) |
| Protected route rejects anonymous callers | PASS | HTTP 401 |
| Login (body parsed, user read from database, JWT issued) | PASS | token issued: True |
| Authenticated database read (/api/products) | PASS | HTTP 200, 613 bytes |
| Aggregate database query (revenue breakdown) | PASS | HTTP 200 |
