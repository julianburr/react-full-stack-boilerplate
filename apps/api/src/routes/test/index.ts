import type { FastifyPluginAsync } from 'fastify';

const test: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/', async () => {
    throw new Error('Test error');
  });
};

export default test;
