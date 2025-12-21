import * as cp from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';

import dotenv from 'dotenv';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, `../${process.env.ENV_PATH}`);
const env = dotenv.parse(fs.readFileSync(envPath, 'utf8'));

const args = ['deploy', '--prod'];

args.push('--token', process.env.VERCEL_API_TOKEN);
args.push('--scope', process.env.VERCEL_ORG_ID);

for (const [k, v] of Object.entries(env)) {
  args.push('--build-env', `${k}=${v}`);
}

for (const [k, v] of Object.entries(env)) {
  if (!k.startsWith('VITE_')) {
    args.push('--env', `${k}=${v}`);
  }
}

const r = cp.spawnSync('vercel', args, { stdio: ['inherit', 'inherit', 'inherit'] });
process.exit(r.status ?? 1);
