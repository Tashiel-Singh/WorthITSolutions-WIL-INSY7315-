# Production verification

Run: 2026-11-01 18:41 (local time)  
Commit: d7fcff5  
Web: https://medflow-web-wil26sc.onrender.com  
API: https://medflow-api-wil26sc.onrender.com  
Pages mirror: https://tashiel-singh.github.io/WorthITSolutions-WIL-INSY7315-/

| Check | Result | Detail |
|---|---|---|
| Web app (Render static site) | PASS | HTTP 200 in 1233 ms (first request, may include a cold start) |
| GitHub Pages mirror | PASS | HTTP 200 in 653 ms (first request, may include a cold start) |
| API /health | PASS | HTTP 200 in 543 ms (first request, may include a cold start) |
| TLS certificate medflow-web-wil26sc.onrender.com | PASS | Tls13, trusted chain, expires 2026-12-21 (49 days left) |
| TLS certificate medflow-api-wil26sc.onrender.com | PASS | Tls13, trusted chain, expires 2026-12-21 (49 days left) |
| HTTP redirects to HTTPS (web) | PASS | https://medflow-web-wil26sc.onrender.com/ |
| CORS allows the web origin | PASS | Access-Control-Allow-Origin: https://medflow-web-wil26sc.onrender.com |
| API latency, 5 warm requests | FAIL | min 387 / avg 540 / max 1047 ms (design target: reads under 500 ms) |
| Protected route rejects anonymous callers | PASS | HTTP 401 |
| Login and authenticated reads | FAIL | The remote server returned an error: (400) Bad Request. |
