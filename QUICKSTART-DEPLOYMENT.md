# Quick Start: Deployment Setup

This is a quick reference for setting up Cloudflare deployments with Pulumi.

## 1. Install Prerequisites

```bash
# Install Pulumi CLI
brew install pulumi  # macOS
# or see: https://www.pulumi.com/docs/get-started/install/

# Install Wrangler CLI (for Workers)
pnpm add -g wrangler
```

## 2. Get Cloudflare Credentials

1. Go to https://dash.cloudflare.com
2. Get your **Account ID** from the right sidebar
3. Create an **API Token**:
   - My Profile → API Tokens → Create Token
   - Use "Edit Cloudflare Workers" template
   - Add permissions: Account:Read, Zone:Read (if using custom domains)

## 3. Set Up Pulumi Infrastructure

```bash
# Navigate to infrastructure directory
cd infrastructure

# Install dependencies
pnpm install

# Login to Pulumi
pulumi login

# Create a stack
pulumi stack init dev

# Configure
pulumi config set cloudflareAccountId YOUR_ACCOUNT_ID
```

## 4. Deploy Infrastructure

```bash
# Preview what will be created
pulumi preview

# Deploy
pulumi up
```

This creates:

- Cloudflare Pages project for frontend
- Configuration for deployments

## 5. Deploy Applications

### Frontend (Cloudflare Pages)

**Option A: Via GitHub Actions (Recommended)**

1. Set GitHub Secrets:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
2. Push to your repository

**Option B: Via Wrangler CLI**

```bash
cd apps/web
pnpm build
wrangler pages deploy apps/web/build/client --project-name=web-dev
```

**Option C: Via Cloudflare Dashboard**

1. Workers & Pages → Create → Pages
2. Connect Git repository
3. Configure build settings

### Backend (Cloudflare Pages Functions)

**All infrastructure is managed via Pulumi** - uses Cloudflare Pages Functions with Node.js-compatible runtime.

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

   This creates the Pages project for the API.

3. **Deploy API code:**

   ```bash
   cd apps/api
   wrangler pages deploy . --project-name=api-${stack}
   ```

4. **Set Environment Variables:**
   Via Cloudflare Dashboard → Pages → Your Project → Settings → Environment Variables

**Note**: Pages Functions run in Node.js-compatible runtime, so your existing Fastify app (`apps/api/src/app.ts`) works directly without any adapters!

## 6. Set Environment Variables

### For Workers:

```bash
cd apps/api
wrangler secret put DATABASE_URL
wrangler secret put CLERK_SECRET_KEY
# etc.
```

### For Pages:

- Cloudflare Dashboard → Your Project → Settings → Environment Variables

## Next Steps

- See `DEPLOYMENT.md` for detailed documentation
- See `infrastructure/README.md` for Pulumi-specific details
- Configure custom domains via Cloudflare Dashboard
