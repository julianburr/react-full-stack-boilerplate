# Deployment Setup Guide

This guide explains how to set up deployments for the React Router web app and Fastify API using Pulumi and GitHub Actions.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Pulumi Account**: Sign up at [pulumi.com](https://pulumi.com) or use self-hosted
3. **GitHub Repository**: Your code should be in a GitHub repository

## Step 1: Get Vercel Credentials

1. Go to [Vercel Settings > Tokens](https://vercel.com/account/tokens)
2. Create a new token and copy it
3. Go to your Vercel Team settings to get your Team ID
4. Go to your Vercel Organization settings to get your Org ID

## Step 2: Set Up Pulumi

1. Install Pulumi CLI:

   ```bash
   curl -fsSL https://get.pulumi.com | sh
   ```

2. Login to Pulumi:

   ```bash
   pulumi login
   ```

3. Navigate to the infrastructure directory:

   ```bash
   cd infrastructure
   ```

4. Install dependencies:

   ```bash
   pnpm install
   ```

5. Initialize Pulumi stacks:

   ```bash
   # Development stack
   pulumi stack init dev
   pulumi config set environment development
   pulumi config set vercelTeamId <your-vercel-team-id>
   pulumi config set --secret vercelApiToken <your-vercel-api-token>

   # Production stack
   pulumi stack init prod
   pulumi config set environment production
   pulumi config set vercelTeamId <your-vercel-team-id>
   pulumi config set --secret vercelApiToken <your-vercel-api-token>
   ```

6. Deploy infrastructure (this creates the Vercel projects):

   ```bash
   pulumi up
   ```

7. Get the project IDs from the outputs:
   ```bash
   pulumi stack output apiProjectId
   pulumi stack output webProjectId
   ```

## Step 3: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add:

- `VERCEL_API_TOKEN`: Your Vercel API token
- `VERCEL_TEAM_ID`: Your Vercel Team ID
- `VERCEL_ORG_ID`: Your Vercel Organization ID
- `PULUMI_ACCESS_TOKEN`: Your Pulumi access token (from [app.pulumi.com/account/tokens](https://app.pulumi.com/account/tokens))

**Note**: The project IDs are now automatically retrieved from Pulumi outputs, so you don't need to set them as secrets.

## Step 4: Add Environment Variables

### In Pulumi (Recommended)

Add environment variables to your Pulumi configuration:

```bash
# Development
pulumi config set --secret databaseUrl <your-database-url>
pulumi config set --secret clerkSecretKey <your-clerk-secret-key>
# ... add other secrets

# Production
pulumi stack select prod
pulumi config set --secret databaseUrl <your-database-url>
pulumi config set --secret clerkSecretKey <your-clerk-secret-key>
# ... add other secrets
```

Then update `infrastructure/index.ts` to use these config values in the environment arrays.

### In Vercel Dashboard (Alternative)

You can also set environment variables directly in the Vercel dashboard for each project.

## Step 5: Deploy

### Automatic Deployment (Development)

Push to the `main` branch to trigger automatic deployment to development.

### Manual Deployment (Production)

1. Go to GitHub Actions
2. Select "Deploy to Production" workflow
3. Click "Run workflow"
4. Select the branch and click "Run workflow"

## Troubleshooting

### API URL Not Available

If the web app can't connect to the API:

1. Ensure the API project is deployed first
2. Check that `VITE_API_URL` is set correctly in the web project's environment variables
3. The Pulumi configuration automatically sets this, but you may need to redeploy after the API is first deployed

### Build Failures

- Check that all dependencies are installed correctly
- Verify build commands in `package.json` files
- Check Vercel build logs for specific errors

### Pulumi Errors

- Ensure you're logged in: `pulumi whoami`
- Check that your Vercel credentials are correct
- Verify the Pulumi stack exists: `pulumi stack ls`
