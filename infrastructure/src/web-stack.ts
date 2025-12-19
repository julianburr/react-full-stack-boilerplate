import * as cloudflare from '@pulumi/cloudflare';
import * as pulumi from '@pulumi/pulumi';

const stack = pulumi.getStack();

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
if (!accountId) {
  throw new Error('CLOUDFLARE_ACCOUNT_ID is not set');
}

const pagesProjectName = `boilerplate-web-${stack}`;
const pagesProject = new cloudflare.PagesProject(pagesProjectName, {
  name: pagesProjectName,
  accountId: accountId,
  productionBranch: 'main',
  buildConfig: {
    buildCommand: 'cd apps/web && pnpm build',
    destinationDir: 'apps/web/build/client',
    rootDir: '/',
  },
});

export const projectName = pagesProject.name;
export const url = pulumi.interpolate`https://${pagesProjectName}.pages.dev`;
