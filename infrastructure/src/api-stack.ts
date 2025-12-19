import * as pulumi from '@pulumi/pulumi';
import * as supabase from '@pulumi/supabase';
import * as vercel from '@pulumiverse/vercel';

const environment = pulumi.getStack();
const vercelTeamId = process.env.VERCEL_TEAM_ID;
const vercelApiToken = process.env.VERCEL_API_TOKEN;

const supabaseAccessToken = process.env.SUPABASE_ACCESS_TOKEN;
const supabaseOrganizationId = process.env.SUPABASE_ORGANIZATION_ID;
const supabaseRegion = process.env.SUPABASE_REGION || 'us-east-1';
const supabaseDatabasePassword = process.env.SUPABASE_DATABASE_PASSWORD;

if (!vercelApiToken) {
  throw new Error('VERCEL_API_TOKEN is not set');
}

if (!supabaseAccessToken) {
  throw new Error('SUPABASE_ACCESS_TOKEN is not set');
}

if (!supabaseOrganizationId) {
  throw new Error('SUPABASE_ORGANIZATION_ID is not set');
}

if (!supabaseDatabasePassword) {
  throw new Error('SUPABASE_DATABASE_PASSWORD is not set');
}

const appName = `boilerplate-app-api-${environment}`;

const vercelProvider = new vercel.Provider(`${appName}-provider`, {
  apiToken: vercelApiToken,
});

const apiProject = new vercel.Project(
  `${appName}-project`,
  {
    name: appName,
    teamId: vercelTeamId,
    framework: 'fastify',
    rootDirectory: 'apps/api',
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

const supabaseProject = new supabase.Project(`${appName}-supabase`, {
  name: appName,
  region: supabaseRegion,
  organizationId: supabaseOrganizationId,
  databasePassword: supabaseDatabasePassword,
});

const dbUser = pulumi.interpolate`postgres.${supabaseProject.id}`;
const poolerHost = pulumi.interpolate`aws-1-${supabaseProject.region}.pooler.supabase.com`;

export const id = apiProject.id;
export const name = apiProject.name;

export const dbProjectId = supabaseProject.id as unknown as string;
export const dbProjectName = supabaseProject.name as unknown as string;
export const dbUrl = pulumi.secret(
  pulumi.interpolate`postgresql://${dbUser}:${supabaseProject.databasePassword}@${poolerHost}:6543/postgres`,
);
