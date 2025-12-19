import { join } from 'node:path';

import { clerkPlugin } from '@clerk/fastify';
import autoLoad from '@fastify/autoload';
import cors from '@fastify/cors';

import type { AutoloadPluginOptions } from '@fastify/autoload';
import type { FastifyPluginAsync, FastifyServerOptions } from 'fastify';

import { logger } from '~/utils/logger';
import { setupSentry } from '~/utils/sentry';

setupSentry();

export interface AppOptions extends FastifyServerOptions, Partial<AutoloadPluginOptions> {}
const options: AppOptions = { logger };

const app: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
  fastify.register(cors, { origin: '*' });
  fastify.register(clerkPlugin);

  fastify.register(autoLoad, { dir: join(__dirname, 'plugins'), options: opts });
  fastify.register(autoLoad, { dir: join(__dirname, 'routes'), options: opts });

  fastify.setErrorHandler((error: any, req, res) => {
    req.log.fatal(error);
    res.status(error.statusCode || 500).send({ error: error.message || 'Internal Server Error' });
  });
};

export default app;
export { app, options };
