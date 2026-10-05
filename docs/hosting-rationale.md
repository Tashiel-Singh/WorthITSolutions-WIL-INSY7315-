# Cloud hosting rationale
- **Render** was selected after the Azure for Students subscription was found disabled (read-only), blocking all Azure resource creation.
- **Managed web service** for the Express API: automatic HTTPS, health-check routing, Git-linked deploys, no server administration.
- **Static site** for the React frontend: CDN-served, automatic TLS, SPA rewrite to index.html.
- **Managed PostgreSQL** keeps the relational model required for tax, VAT and invoicing, so the Prisma schema and migrations from the ERD run unchanged.
- **Deploy hooks + GitHub Actions** keep deployment under pipeline control, matching the Azure design where Actions drove App Service releases.
- **Alternatives rejected**: Firebase/NoSQL (no relational integrity, rejected in design section 12.1), microservices (overhead for a 4-person team).
