import type { FastifyPluginAsync } from 'fastify';

import { BadRequestError } from '~/utils/errors';

const test: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async function () {
    return { success: true };
  });

  fastify.get('/error', async function () {
    throw new BadRequestError('Foo');
  });
};

export default test;
