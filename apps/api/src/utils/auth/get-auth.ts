import { getAuth as getClerkAuth } from '@clerk/fastify';

import type { FastifyRequest } from 'fastify';

export function getAuth(req: FastifyRequest) {
  return getClerkAuth(req, { acceptsToken: ['session_token'] });
}
