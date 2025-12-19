import * as cloudflare from '@pulumi/cloudflare';
import * as pulumi from '@pulumi/pulumi';

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
if (!accountId) {
  throw new Error('CLOUDFLARE_ACCOUNT_ID is not set');
}

const stack = pulumi.getStack();

const apiPagesProjectName = `boilerplate-api-${stack}`;
const apiPagesProject = new cloudflare.PagesProject(apiPagesProjectName, {
  name: apiPagesProjectName,
  accountId: accountId,
  productionBranch: 'main',
  buildConfig: {
    buildCommand: 'cd apps/api && pnpm build',
    destinationDir: 'apps/api',
    rootDir: '/',
  },
});

// Outputs
export const projectName = apiPagesProject.name;
export const url = pulumi.interpolate`https://${apiPagesProjectName}.pages.dev`;
