import type { SignedInAuthObject } from '@clerk/backend/internal';
import type { FastifyRequest } from 'fastify';

import { getAuth } from '~/utils/auth/get-auth';
import { UnauthorizedError } from '~/utils/errors';

type FixedSignedInAuthObject = Omit<SignedInAuthObject, 'isAuthenticated' | 'orgId' | 'userId'> & {
  isAuthenticated: true;
  orgId: string;
  userId: string;
};

export function ensureAuth(req: FastifyRequest) {
  const auth = getAuth(req);

  if (!auth.isAuthenticated || !auth.userId) {
    throw new UnauthorizedError();
  }

  return auth as FixedSignedInAuthObject;
}
