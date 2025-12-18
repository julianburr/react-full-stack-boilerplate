import * as cp from 'node:child_process';
import * as path from 'node:path';
import * as url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, '..');

export async function uploadSourcemaps() {
  if (!process.env.SENTRY_AUTH_TOKEN) {
    return;
  }

  await new Promise((resolve, reject) => {
    const child = cp.spawn(
      'sentry-cli',
      ['sourcemaps', 'upload', `--release=${process.env.RELEASE_VERSION || '0.0.0-local.0'}`, root],
      {
        cwd: root,
        env: process.env,
        stdio: 'inherit',
        shell: true,
      },
    );

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`sentry-cli exited with code ${code}`));
      }
    });

    child.on('error', reject);
  });
}

uploadSourcemaps();
