import * as pulumi from '@pulumi/pulumi';
import * as vercel from '@pulumiverse/vercel';

const environment = pulumi.getStack();
const vercelTeamId = process.env.VERCEL_TEAM_ID;
const vercelApiToken = process.env.VERCEL_API_TOKEN;

const appName = `boilerplate-app-web-${environment}`;

const vercelProvider = new vercel.Provider(`${appName}-provider`, {
  apiToken: vercelApiToken,
});

const webProject = new vercel.Project(
  `${appName}-project`,
  {
    name: appName,
    teamId: vercelTeamId,
    framework: 'react-router',
    rootDirectory: 'apps/web',
    installCommand: 'pnpm install --frozen-lockfile',
    buildCommand: 'pnpm build',
    nodeVersion: '22.x',
    serverlessFunctionRegion: 'iad1',
    vercelAuthentication: {
      deploymentType: 'none',
    },
  },
  { provider: vercelProvider },
);

export const id = webProject.id;
export const name = webProject.name;
