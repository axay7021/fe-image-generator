# Real application deployment

This Next.js frontend and axay7021/be-image-generator are one application. Deploy the actual Next.js root to Vercel, not public/portfolio. Intended account: 190020107022ait@gmail.com; personal scope akshay-dobariyas-projects (team_VifP2fo09snOry74VZ0VlNYH).

Render backend: https://ai-image-generator-api-m2c0.onrender.com . Render reports deploy dep-dbhjjdhsrm7s73812ddg LIVE at commit 934c95a. Database, Clerk and Gemini are not configured on the service yet. AI functionality is not verified or claimed.

Vercel environment:
- NEXT_PUBLIC_BASE_URL=https://ai-image-generator-api-m2c0.onrender.com/api/v1
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: configure your real Clerk application's public key.
- CLERK_SECRET_KEY: configure the corresponding secret through Vercel's encrypted environment settings.

The frontend appends /modify-image/... itself. Do not omit or duplicate /api/v1. Set the actual frontend origin as FRONTEND_URL in Render. Set the corresponding backend CLERK_SECRET_KEY and CLERK_JWKS_URL in Render. No credentials are committed here.

Vercel project creation returned 403: the existing connection needs scope consent. Authorize team_VifP2fo09snOry74VZ0VlNYH using the Vercel plugin's authorize_team_access flow, then retry. Do not use softcolon326 or akshay@softcolon.com.

## TODO

- [ ] Grant Vercel scope access and create/deploy the actual Next.js project.
- [ ] Configure Clerk keys for frontend and backend through secure hosting settings.
- [ ] Connect the provisioned Render Postgres internal URL to backend DATABASE_URL, then redeploy and verify Alembic head b8c5e2f1d3a7. The free database expires 28 November 2026.
- [ ] Leave backend GEMINI_API_KEY empty; owner will add it later in Render Environment.
- [ ] Redeploy after credential configuration and verify real signup/login, image upload, database quota and Gemini generation through the frontend.
- [ ] Update the portfolio case study with the actual frontend URL only after deployment and verification.

The cloud network could not directly fetch the Render origin (proxy CONNECT timeout); Render's terminal deploy status and application startup logs are verified, but external HTTP and full end-to-end checks remain pending.

## Vercel access and source deployment update

Personal workspace access was approved on 30 October 2026. Project `ai-image-generator` is created in team_VifP2fo09snOry74VZ0VlNYH. Git import currently requires Vercel GitHub integration installation, so the deployment uses a pinned public source snapshot fetched in the build step. Automatic Git deployments are not enabled yet.

The root layout shows an explicit setup-pending page when Clerk public or secret configuration is absent. This allows a truthful hosted application instead of a build failure. It never supplies fake Clerk credentials and does not claim image generation is operational. Once real Clerk credentials are set in Vercel, rebuild to render the full existing application.
