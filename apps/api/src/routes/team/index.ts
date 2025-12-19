import type { FastifyPluginAsync } from 'fastify';

import { ensureAuth } from '~/features/auth';
import { ensureCustomer } from '~/features/billing/ensure-customer';
import { getClerkClient } from '~/utils/clerk';
import { BadRequestError, ForbiddenError, NotFoundError } from '~/utils/errors';
import { getStripeClient } from '~/utils/stripe';

const team: FastifyPluginAsync = async (fastify): Promise<void> => {
  /**
   * Create new org
   */
  fastify.post<{ Body: { name: string; email: string } }>('/', async (req) => {
    const auth = await ensureAuth(req);

    if (!auth.org?.id) {
      throw new BadRequestError('Organization not found');
    }

    // Create org in Clerk
    const clerk = getClerkClient();
    await clerk.organizations.createOrganizationMembership({
      organizationId: auth.org.id,
      userId: auth.userId,
      role: 'org:admin',
    });

    // Create customer in Stripe
    await ensureCustomer({ auth });

    return { success: true };
  });

  /**
   * Update org
   */
  fastify.patch<{ Body: { name: string; email: string } }>('/', async (req) => {
    const auth = await ensureAuth(req);
    if (auth.orgRole !== 'org:admin') {
      throw new ForbiddenError();
    }

    // Update org in Clerk
    const clerk = getClerkClient();
    const updatedOrg = await clerk.organizations.updateOrganization(auth.orgId, {
      name: req.body.name,
      privateMetadata: {
        ...(auth.org?.privateMetadata || {}),
        email: req.body.email,
      },
    });

    // Update stripe customer
    const stripe = getStripeClient();
    const customer = await ensureCustomer({ auth });
    await stripe.customers.update(customer.id, {
      email: req.body.email,
      name: req.body.name,
      metadata: {
        orgId: auth.orgId,
        orgSlug: auth.orgSlug ?? '',
      },
    });

    return { success: true, data: updatedOrg };
  });

  /**
   * Delete org
   */
  fastify.delete('/', async (req) => {
    const auth = await ensureAuth(req);
    if (auth.orgRole !== 'org:admin') {
      throw new ForbiddenError();
    }

    // Get org from Clerk
    const clerk = getClerkClient();
    const org = await clerk.organizations.getOrganization({ organizationId: auth.orgId });
    if (!org) {
      throw new NotFoundError('Organization not found');
    }

    // Cancel subscription in Stripe
    const stripe = getStripeClient();
    const customerId = org.privateMetadata.stripeCustomerId as string;
    if (customerId) {
      const customer = await stripe.customers.retrieve(customerId);
      if (customer && 'subscriptions' in customer && customer.subscriptions?.data[0].id) {
        await stripe.subscriptions.cancel(customer.subscriptions?.data[0].id);
      }
      await stripe.customers.update(customer.id, {
        metadata: {
          orgId: auth.orgId,
          deletedAt: new Date().toISOString(),
        },
      });
    }

    // Delete org in Clerk
    // TODO: think about soft deleting instead
    await clerk.organizations.deleteOrganization(auth.orgId);

    return { success: true };
  });
};

export default team;
