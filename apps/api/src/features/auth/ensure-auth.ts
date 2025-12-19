import type { getFlags } from './get-flags';
import type { Organization, User } from '@clerk/backend';
import type { SignedInAuthObject } from '@clerk/backend/internal';
import type { FastifyRequest } from 'fastify';

import { UnauthorizedError } from '~/utils/errors';

type SignedInSession = Omit<
  Awaited<SignedInAuthObject>,
  'isAuthenticated' | 'orgId' | 'userId' | 'user'
> & {
  isSignedIn: true;
  orgId: string;
  userId: string;
  user: User;
  org?: Organization | null;
  flags?: Awaited<ReturnType<typeof getFlags>> | null;
};

export async function ensureAuth(req: FastifyRequest) {
  if (!req.session?.isSignedIn || !req.session?.userId) {
    throw new UnauthorizedError();
  }

  return req.session as SignedInSession;
}
