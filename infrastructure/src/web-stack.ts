import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';

import * as cloudflare from '@pulumi/cloudflare';
import * as pulumi from '@pulumi/pulumi';

function sha256File(filePath: string) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
if (!accountId) {
  throw new Error('CLOUDFLARE_ACCOUNT_ID is not set');
}

const zoneId = process.env.CLOUDFLARE_ZONE_ID;
const routePattern = process.env.CLOUDFLARE_ROUTE_PATTERN;
const scriptName = 'boilerplate-app-web';

const mainModule = 'workers/placeholder.js';
const contentFile = path.resolve(__dirname, `../../apps/web/${mainModule}`);

// Create the Worker once (placeholder code)
const worker = new cloudflare.WorkersScript(
  'web-worker',
  {
    accountId,
    scriptName,
    mainModule,
    contentFile,
    contentSha256: sha256File(contentFile),
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
