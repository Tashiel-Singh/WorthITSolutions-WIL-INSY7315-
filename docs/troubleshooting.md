# Hosting troubleshooting
- First request slow: free services wake in about a minute. Hit /health before presenting.
- Build fails: check Render service Logs tab; confirm rootDir and build command in render.yaml.
- 502 after deploy: confirm the app listens on process.env.PORT.
- DB errors: confirm prisma/migrations is committed; startCommand runs prisma migrate deploy.
- CORS errors: CORS_ORIGIN must equal the frontend URL exactly.
