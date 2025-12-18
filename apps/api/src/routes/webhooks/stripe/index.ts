import type { FastifyPluginAsync } from 'fastify';

const webhooksStripe: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/', async function () {
    return { success: true };
  });
};

export default webhooksStripe;
