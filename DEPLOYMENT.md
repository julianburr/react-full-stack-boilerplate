# Deployment Guide

This guide explains how to deploy the React Full Stack Boilerplate to Cloudflare using Pulumi.

## Overview

- **Frontend**: Deployed to Cloudflare Pages
- **Backend API**: Deployed to Cloudflare Workers (with Node.js compatibility)

## Prerequisites

1. **Cloudflare Account**
   - Sign up at https://cloudflare.com
   - Get your Account ID from the dashboard
   - Create an API token with appropriate permissions

2. **Pulumi Account**
   - Sign up at https://app.pulumi.com
   - Install Pulumi CLI: `brew install pulumi` (macOS) or see [installation guide](https://www.pulumi.com/docs/get-started/install/)

3. **Wrangler CLI** (for Workers)
   ```bash
   npm install -g wrangler
   # or
   pnpm add -g wrangler
   ```

## Initial Setup

### 1. Install Dependencies

```bash
# Install root dependencies
pnpm install

# Install infrastructure dependencies
cd infrastructure
pnpm install
```

### 2. Configure Pulumi

```bash
cd infrastructure

# Login to Pulumi
pulumi login

# Create a stack (e.g., production or staging)
pulumi stack init production

# Set required configuration
pulumi config set cloudflareAccountId YOUR_ACCOUNT_ID
pulumi config set cloudflareZoneId YOUR_ZONE_ID  # Optional
pulumi config set domain yourdomain.com  # Optional
```

### 3. Configure Cloudflare API Token

Get your Cloudflare API token:

1. Go to Cloudflare Dashboard → My Profile → API Tokens
2. Create a token with:
   - Account: Workers:Edit, Workers Scripts:Edit
   - Zone: Zone:Read, DNS:Edit
   - Account: Account:Read, User:Read

Set it as an environment variable or Pulumi secret:

```bash
pulumi config set --secret cloudflareApiToken YOUR_API_TOKEN
```

## Deploy Infrastructure

### 1. Preview Changes

```bash
cd infrastructure
pulumi preview
```

### 2. Deploy

```bash
pulumi up
```

This will create:

- Cloudflare Pages project for the frontend
- Cloudflare Workers for the backend (if configured)
- DNS records (if custom domain is configured)

## Deploy Applications

### Frontend (Cloudflare Pages)

#### Option 1: Via GitHub Actions (Recommended)

1. Set up GitHub Secrets:
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
   - `VITE_BASE_URL`: Base URL for your frontend
   - `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`: For Sentry (optional)

2. Push to your repository - the GitHub Action will automatically deploy

#### Option 2: Via Wrangler CLI

```bash
cd apps/web
pnpm build
wrangler pages deploy apps/web/build/client --project-name=web-production
```

#### Option 3: Via Cloudflare Dashboard

1. Go to Workers & Pages → Create → Pages
2. Connect your Git repository
3. Configure build settings:
   - Build command: `cd apps/web && pnpm build`
   - Build output directory: `apps/web/build/client`
   - Root directory: `/`

### Backend (Cloudflare Pages Functions)

**All infrastructure is managed via Pulumi** - uses Cloudflare Pages Functions which run in a Node.js-compatible runtime, allowing the existing Fastify app to work without adapters.

1. **Build the API:**

   ```bash
   cd apps/api
   pnpm build
   ```

2. **Deploy via Pulumi:**

   ```bash
   cd infrastructure
   pulumi up
   ```

   This will:
   - Create/update the Cloudflare Pages project for the API
   - Pages Functions in `apps/api/functions/` are automatically deployed
   - The Fastify app is used directly (no adapter needed!)

3. **Deploy the API code:**
   After infrastructure is created, deploy the API code:

   ```bash
   cd apps/api
   wrangler pages deploy . --project-name=api-${stack}
   ```

   Or via Cloudflare Dashboard → Pages → Your Project → Deployments

4. **Set Environment Variables:**
   Set environment variables (including secrets) via:
   - Cloudflare Dashboard → Pages → Your Project → Settings → Environment Variables
   - Or via Cloudflare API in CI/CD

**Note**: Pages Functions run in a Node.js-compatible runtime, so your existing Fastify app works without modifications. The function in `apps/api/functions/[[path]].ts` uses Fastify's `inject` method to handle requests.

## Environment Variables

### Frontend (Pages)

Set in Cloudflare Dashboard → Pages → Your Project → Settings → Environment Variables:

- `VITE_BASE_URL`: Base URL for the frontend
- `VITE_API_URL`: URL of your API
- `SENTRY_*`: Sentry configuration (optional)

### Backend (Workers)

Set via Wrangler:

```bash
cd apps/api
wrangler secret put DATABASE_URL
wrangler secret put CLERK_SECRET_KEY
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put FLAGSMITH_API_KEY
# etc.
```

Or via Cloudflare Dashboard → Workers → Your Worker → Settings → Variables

## Custom Domains

### Via Pulumi

1. Set domain in Pulumi config:

   ```bash
   pulumi config set domain api.yourdomain.com
   pulumi config set cloudflareZoneId YOUR_ZONE_ID
   ```

2. Update infrastructure:
   ```bash
   pulumi up
   ```

### Via Cloudflare Dashboard

1. Go to Workers & Pages → Your Project → Custom Domains
2. Add your custom domain
3. Update DNS records as instructed

## Database Considerations

Cloudflare Workers have limitations with traditional PostgreSQL connections. Consider:

1. **Use Cloudflare D1** (SQLite-based, serverless)
2. **Use HTTP-based database APIs** (e.g., Supabase, PlanetScale)
3. **Use Cloudflare Tunnel** to connect to your existing database
4. **Deploy API separately** on a platform that supports Node.js (e.g., Railway, Render)

## Monitoring and Debugging

### View Logs

**Workers:**

```bash
wrangler tail
```

**Pages:**

- Cloudflare Dashboard → Workers & Pages → Your Project → Logs

### Error Tracking

- Sentry is already configured in both apps
- Set `SENTRY_DSN` environment variable

## CI/CD

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that:

- Builds and deploys the frontend on push to main/develop
- Builds and deploys the backend on push to main/develop

Configure GitHub Secrets as described above.

## Troubleshooting

### Build Failures

- Check Node.js version compatibility
- Ensure all dependencies are installed
- Verify build commands in `package.json`

### Runtime Errors

- Check Cloudflare Workers runtime compatibility
- Review Worker logs: `wrangler tail`
- Check Pages Function logs in dashboard

### Database Connection Issues

- Verify DATABASE_URL is set correctly
- Check if your database allows connections from Cloudflare IPs
- Consider using connection pooling or HTTP-based database APIs

## Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Pulumi Cloudflare Provider](https://www.pulumi.com/registry/packages/cloudflare/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
