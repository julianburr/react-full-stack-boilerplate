# Infrastructure as Code with Pulumi

This directory contains the Pulumi infrastructure code for deploying the React Full Stack Boilerplate to Cloudflare.

## Prerequisites

1. Install Pulumi CLI: https://www.pulumi.com/docs/get-started/install/
2. Install Node.js and pnpm
3. Cloudflare account with API token

## Setup

1. **Install dependencies:**

   ```bash
   cd infrastructure
   pnpm install
   ```

2. **Configure Pulumi:**

   ```bash
   pulumi login
   ```

3. **Create a stack:**

   ```bash
   pulumi stack init dev  # or production, staging, etc.
   ```

4. **Set required configuration:**

   ```bash
   pulumi config set cloudflareAccountId YOUR_ACCOUNT_ID
   ```

5. **Set optional configuration:**
   ```bash
   pulumi config set cloudflareZoneId YOUR_ZONE_ID  # Optional, for custom domains/routes
   pulumi config set apiDomain api.yourdomain.com  # Optional, for custom API domain
   pulumi config set productionBranch main
   pulumi config set buildCommand "cd apps/web && pnpm build"
   pulumi config set destinationDir "apps/web/build/client"
   pulumi config set workerCompatibilityDate "2024-01-01"
   pulumi config set workerCompatibilityFlags '["nodejs_compat"]'
   ```

## Deploy

1. **Preview changes:**

   ```bash
   pulumi preview
   ```

2. **Deploy infrastructure:**

   ```bash
   pulumi up
   ```

3. **Destroy infrastructure (if needed):**
   ```bash
   pulumi destroy
   ```

## Stacks

Pulumi uses stacks to manage different environments. Create a new stack for each environment:

```bash
# Create a production stack
pulumi stack init production

# Create a staging stack
pulumi stack init staging

# Switch between stacks
pulumi stack select production
```

## Outputs

After deployment, Pulumi will output:

- `pagesProjectNameOutput`: Name of the Cloudflare Pages project
- `pagesUrl`: URL of the deployed frontend
- `apiWorkerName`: Name of the Cloudflare Worker
- `apiWorkerUrl`: URL of the deployed API Worker
- `accountIdOutput`: Cloudflare account ID
- `zoneIdOutput`: Cloudflare zone ID (if configured)

## Environment Variables

### Plain Text Variables (Non-Secrets)

Set via Pulumi config for Workers:

```bash
pulumi config set workerPlainBindings '{"NODE_ENV":"production","API_VERSION":"v1"}'
```

### Secrets

Secrets cannot be set via Pulumi for security reasons. Set them using:

1. **Via Wrangler CLI:**

   ```bash
   cd apps/api
   wrangler secret put --name api-${stack} DATABASE_URL
   wrangler secret put --name api-${stack} CLERK_SECRET_KEY
   # etc.
   ```

2. **Via Cloudflare Dashboard:**
   - Go to Workers & Pages → Your Worker → Settings → Variables → Secrets

3. **Via Cloudflare API in CI/CD:**
   - Use Cloudflare API to set secrets programmatically in your deployment pipeline

## Architecture

- **Frontend**: Deployed to Cloudflare Pages (managed via Pulumi)
- **Backend API**: Deployed to Cloudflare Workers (managed via Pulumi)
  - Worker script is read from `apps/api/dist/worker.js`
  - Build the worker before running `pulumi up`: `cd apps/api && pnpm build:worker`
  - Routes are automatically configured if `zoneId` and `apiDomain` are set
  - Uses `nodejs_compat` flag for Node.js compatibility

## Notes

- The Fastify API uses Node.js-specific features (PostgreSQL, file system, etc.)
- For full compatibility, consider using Cloudflare Pages Functions or Workers with `nodejs_compat` flag
- Database connections may need to be adapted for Cloudflare's runtime limitations
- Custom domains should be configured via Cloudflare Dashboard after initial deployment
