# Infrastructure

This directory contains Pulumi infrastructure as code for managing Vercel deployments.

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Login to Pulumi:

   ```bash
   pulumi login
   ```

3. Configure Pulumi stack:

   ```bash
   # For development
   pulumi stack init dev
   pulumi config set environment development
   pulumi config set vercelTeamId <your-vercel-team-id>
   pulumi config set --secret vercelApiToken <your-vercel-api-token>

   # For production
   pulumi stack init prod
   pulumi config set environment production
   pulumi config set vercelTeamId <your-vercel-team-id>
   pulumi config set --secret vercelApiToken <your-vercel-api-token>
   ```

## Usage

- Preview changes: `pnpm preview`
- Deploy: `pnpm deploy`
- Destroy: `pnpm destroy`

## Environment Variables

Add environment variables to the Pulumi config or directly in the `index.ts` file. For secrets, use:

```bash
pulumi config set --secret <key> <value>
```
