import { getAuth } from '@clerk/fastify';
import * as Sentry from '@sentry/node';
import fp from 'fastify-plugin';

import type { Organization, User } from '@clerk/backend';
import type { FastifyPluginAsync } from 'fastify';

import { getFlags } from '~/features/auth/get-flags';
import { getClerkClient } from '~/utils/clerk';
import { logger } from '~/utils/logger';

type RequestContext = {
  id: string;
  requestId?: string;
  method: string;
  url: string;
  path?: string;
  ip?: string;
  userAgent?: string;
};

type SessionContext = {
  isSignedIn: boolean;
  userId?: string;
  userEmail?: string;
  orgId?: string;
  orgSlug?: string;
  orgName?: string;
  flags?: Awaited<ReturnType<typeof getFlags>>;
  sessionId?: string | null;
  user?: User | null;
  org?: Organization | null;
};

declare module 'fastify' {
  interface FastifyRequest {
    session?: SessionContext | null;
    request?: RequestContext | null;
  }
}

const requestContextPlugin: FastifyPluginAsync = async (app) => {
  app.decorateRequest<SessionContext | null>('session', null);
  app.decorateRequest<RequestContext | null>('request', null);

  app.addHook('preHandler', async (req) => {
    const clerkAuth = getAuth(req, { acceptsToken: ['session_token'] });

    // Load user and org from Clerk
    const clerk = getClerkClient();
    const [user, org] = await Promise.all([
      'userId' in clerkAuth && clerkAuth.userId ? clerk.users.getUser(clerkAuth.userId) : null,
      'orgId' in clerkAuth && clerkAuth.orgId
        ? clerk.organizations.getOrganization({ organizationId: clerkAuth.orgId })
        : null,
    ]);

    // Load flags from Flagsmith
    const flags = await getFlags({ auth: clerkAuth, user, org });

    // Create request & session context
    const requestContext = {
      id: req.id,
      requestId: req.headers['x-request-id'] as string | undefined,
      method: req.method,
      url: req.url,
      path: req.routeOptions?.url,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    };

    const sessionContext = {
      isSignedIn: !!clerkAuth.isAuthenticated,
      userId: user?.id,
      userEmail: user?.emailAddresses[0].emailAddress,
      orgId: org?.id,
      orgSlug: org?.slug,
      orgName: org?.name,
      flags: flags,
      sessionId: 'sessionId' in clerkAuth ? clerkAuth.sessionId : undefined,
    };

    // Attach relevant context to Sentry
    Sentry.setContext('request', requestContext);
    Sentry.setUser({ id: user?.id, ...sessionContext });

    // Attach context to Fastify request & logger instance
    req.session = { ...sessionContext, user, org };
    req.request = requestContext;
    req.log = logger.child({
      session: sessionContext,
      request: requestContext,
    });
  });

  app.addHook('onResponse', (req, res, done) => {
    // To be able to get general response stats in Logtail, we log `onResponse` here, with a special flag
    // (so we can filter for it) and the response status code
    const requestLog = `${req.method} ${req.url} (${res.statusCode})`;
    const requestLogMethod = res.statusCode >= 400 ? 'error' : 'info';
    req.log[requestLogMethod]({ isRequestLog: true, statusCode: res.statusCode }, requestLog);
    done();
  });
};

export default fp(requestContextPlugin, { name: 'context-plugin' });
