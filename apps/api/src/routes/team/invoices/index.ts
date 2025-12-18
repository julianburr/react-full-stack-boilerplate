import camelcaseKeys from 'camelcase-keys';

import type { FastifyPluginAsync } from 'fastify';

import { ensureAuth } from '~/utils/auth';
import { getClerkClient } from '~/utils/clerk';
import { getStripeClient } from '~/utils/stripe';

const invoices: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/', async function (req) {
    const auth = ensureAuth(req);

    const clerk = getClerkClient();
    const org = await clerk.organizations.getOrganization({ organizationId: auth.orgId });

    const customerId = org.privateMetadata.stripeCustomerId as string;
    if (!customerId) {
      return { data: [] };
    }

    const stripe = getStripeClient();
    const invoices = await stripe.invoices.list({ customer: customerId });

    // TODO: paginate
    return { data: camelcaseKeys(invoices.data) } as const;
  });
};

export default invoices;
