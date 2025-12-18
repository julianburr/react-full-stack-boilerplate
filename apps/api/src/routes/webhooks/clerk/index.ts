import type { FastifyPluginAsync } from 'fastify';

const webhooksClerk: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/', async function () {
    return { success: true };
  });

  fastify.post('/emails', async function () {
    return { success: true };
  });

  fastify.post('/sms', async function () {
    return { success: true };
  });
};

export default webhooksClerk;
