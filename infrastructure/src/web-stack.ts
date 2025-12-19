import * as path from 'node:path';

import * as cloudflare from '@pulumi/cloudflare';
import * as pulumi from '@pulumi/pulumi';

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
if (!accountId) {
  throw new Error('CLOUDFLARE_ACCOUNT_ID is not set');
}

const stack = pulumi.getStack();

const zoneId = process.env.CLOUDFLARE_ZONE_ID;
const routePattern = process.env.CLOUDFLARE_ROUTE_PATTERN;
const scriptName = `boilerplate-app-web-${stack}`;

const mainModule = 'workers/app.ts';
const contentFile = path.resolve(__dirname, `../apps/web/${mainModule}`);

// Create the Worker once (placeholder code)
const worker = new cloudflare.WorkersScript(
  'web-worker',
  {
    accountId,
    scriptName,
    mainModule,
    contentFile,
    compatibilityDate: '2025-12-01',
  },
  // Let Wrangler deploy code without Pulumi trying to revert it
  {
    ignoreChanges: ['content', 'contentFile', 'contentSha256', 'mainModule', 'modules', 'assets'],
  },
);

// Route + domain owned by Pulumi
if (zoneId && routePattern) {
  new cloudflare.WorkersRoute('web-route', {
    zoneId,
    pattern: routePattern,
    script: worker.scriptName,
  });
}

export const name = scriptName;
export const webUrl =
  zoneId && routePattern
    ? pulumi.interpolate`https://${routePattern.replace('/*', '')}`
    : pulumi.interpolate`https://${scriptName}.workers.dev`;
