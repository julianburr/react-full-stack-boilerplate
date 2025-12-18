import camelcaseKeys from 'camelcase-keys';

import type { FastifyPluginAsync } from 'fastify';

import { ensureCustomer } from '~/features/billing/ensure-customer';
import { ensureAuth } from '~/utils/auth';
import { getClerkClient } from '~/utils/clerk';
import { ForbiddenError, NotFoundError } from '~/utils/errors';
import { getStripeClient } from '~/utils/stripe';

const paymentMethods: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/', async function (req) {
    const auth = ensureAuth(req);

    const clerk = getClerkClient();
    const org = await clerk.organizations.getOrganization({ organizationId: auth.orgId });

    const customerId = org.privateMetadata.stripeCustomerId as string;
    if (!customerId) {
      return { data: [] };
    }

    const stripe = getStripeClient();
    const customer = await ensureCustomer({ auth, org });
    const paymentMethods = await stripe.paymentMethods.list({ customer: customer.id });

    // Add extra info regarding default payment method
    // TODO: paginate
    const fixedPaymentMethods = paymentMethods.data?.map((item) => {
      return camelcaseKeys({
        ...item,
        isDefault:
          'invoice_settings' in customer &&
          item.id === customer.invoice_settings?.default_payment_method,
      });
    });

    return { data: fixedPaymentMethods || [] };
  });

  fastify.post('/', async function (req) {
    const auth = ensureAuth(req);

    const clerk = getClerkClient();
    const org = await clerk.organizations.getOrganization({ organizationId: auth.orgId });
    const customer = await ensureCustomer({ auth, org });

    const stripe = getStripeClient();
    const intent = await stripe.setupIntents.create({ customer: customer.id });

    return { success: true, data: camelcaseKeys(intent) };
  });

  fastify.post<{ Params: { paymentMethodId: string } }>(
    '/:paymentMethodId/set-default',
    async function (req) {
      const auth = ensureAuth(req);

      const clerk = getClerkClient();
      const org = await clerk.organizations.getOrganization({ organizationId: auth.orgId });
      const customer = await ensureCustomer({ auth, org });

      const stripe = getStripeClient();
      const paymentMethod = await stripe.paymentMethods.retrieve(req.params.paymentMethodId);
      if (!paymentMethod.id) {
        throw new NotFoundError('Payment method not found');
      }

      await stripe.customers.update(customer.id, {
        invoice_settings: {
          default_payment_method: paymentMethod.id,
        },
      });

      return { success: true, data: camelcaseKeys(paymentMethod) };
    },
  );

  fastify.delete<{ Params: { paymentMethodId: string } }>(
    '/:paymentMethodId',
    async function (req) {
      const auth = ensureAuth(req);

      const clerk = getClerkClient();
      const org = await clerk.organizations.getOrganization({ organizationId: auth.orgId });
      const customer = await ensureCustomer({ auth, org });

      const stripe = getStripeClient();
      const paymentMethod = await stripe.paymentMethods.retrieve(req.params.paymentMethodId);
      if (paymentMethod.customer !== customer.id) {
        throw new ForbiddenError();
      }

      await stripe.paymentMethods.detach(paymentMethod.id);

      return { success: true };
    },
  );
};

export default paymentMethods;
