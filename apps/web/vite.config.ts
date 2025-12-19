import * as path from 'node:path';

import { cloudflare } from '@cloudflare/vite-plugin';
import { reactRouter } from '@react-router/dev/vite';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

const root = path.resolve(__dirname, '.');
const app = path.resolve(__dirname, 'app');

export default defineConfig({
  root,
  base: process.env.VITE_BASE_URL || '/',
  resolve: {
    alias: {
      '~': app,
    },
  },
  build: {
    sourcemap: true,
    manifest: true,
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    reactRouter(),
    svgr(),
    tsconfigPaths(),
    sentryVitePlugin({
      disable: !process.env.SENTRY_AUTH_TOKEN,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      release: { name: process.env.VITE_RELEASE_VERSION || '0.0.0-local.0' },
      telemetry: false,
    }),
  ],
});
