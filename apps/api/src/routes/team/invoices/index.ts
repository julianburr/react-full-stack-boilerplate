import camelcaseKeys from 'camelcase-keys';

import type { FastifyPluginAsync } from 'fastify';

import { ensureAuth } from '~/features/auth';
import { getStripeClient } from '~/utils/stripe';

const invoices: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/', async function (req) {
    const auth = await ensureAuth(req);

    const customerId = auth.org?.privateMetadata.stripeCustomerId as string;
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
