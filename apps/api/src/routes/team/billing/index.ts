import type { FastifyPluginAsync } from 'fastify';

import { ensureAuth } from '~/features/auth';
import { ensureCustomer } from '~/features/billing/ensure-customer';
import { BadRequestError } from '~/utils/errors';
import { getStripeClient } from '~/utils/stripe';

const billing: FastifyPluginAsync = async (fastify): Promise<void> => {
  /**
   * Upgrade subscription and cancel any existing subscription
   */
  fastify.post<{ Body: { price: string } }>('/upgrade', async function (req) {
    const price = req.body.price;
    if (!price) {
      throw new BadRequestError('Price is required');
    }

    const auth = await ensureAuth(req);

    const stripe = getStripeClient();
    const c = await ensureCustomer({ auth });

    const customer = await stripe.customers.retrieve(c.id, { expand: ['subscriptions'] });
    if (customer.deleted) {
      throw new BadRequestError('Customer is deleted');
    }

    const subscription = customer.subscriptions?.data?.find((s) => s.status === 'active');
    if (subscription?.items.data[0].price.id === price) {
      // The price is unchanged, do nothing
      // Check if the subscription is scheduled to be cancelled, if so reverse that and resume it
      if (subscription.cancel_at_period_end) {
        await stripe.subscriptions.update(subscription.id, {
          cancel_at_period_end: false,
        });
      }
      return { success: true, data: subscription };
    }

    // The price is different
    // Cancel the existing subscription + create a new one for the given price
    if (subscription?.id) {
      await stripe.subscriptions.cancel(subscription.id);
    }

    const newSubscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price }],
    });

    return { success: true, data: newSubscription };
  });

  /**
   * Downgrade by cancelling any existing subscriptions at the end of the current period
   */
  fastify.post('/downgrade', async function (req) {
    const auth = await ensureAuth(req);

    const stripe = getStripeClient();
    const c = await ensureCustomer({ auth });

    const customer = await stripe.customers.retrieve(c.id, { expand: ['subscriptions'] });
    if (customer.deleted) {
      throw new BadRequestError('Customer is deleted');
    }

    const subscription = customer.subscriptions?.data?.find((s) => s.status === 'active');
    if (subscription?.id) {
      const stripe = getStripeClient();
      await stripe.subscriptions.update(subscription.id, {
        cancel_at_period_end: true,
      });
    }

    return { success: true };
  });
};

export default billing;
