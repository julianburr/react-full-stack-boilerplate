import type { ensureAuth } from '~/features/auth';

import { getClerkClient } from '~/utils/clerk';
import { BadRequestError, NotFoundError } from '~/utils/errors';
import { getStripeClient } from '~/utils/stripe';

type Args = {
  auth: Awaited<ReturnType<typeof ensureAuth>>;
};

export async function ensureCustomer({ auth }: Args) {
  if (!auth.org) {
    throw new BadRequestError('Organization not found');
  }

  const email = auth.org.privateMetadata.email as string;
  const customerId = auth.org.privateMetadata.stripeCustomerId as string;
  if (!email) {
    throw new BadRequestError('Organization email is not set');
  }

  if (customerId) {
    const stripe = getStripeClient();
    const customer = await stripe.customers.retrieve(customerId);
    if (!customer) {
      throw new NotFoundError('Could not find Stripe customer');
    }
    return customer;
  }

  const stripe = getStripeClient();
  const customer = await stripe.customers.create({
    email,
    name: auth.org.name,
    metadata: {
      orgId: auth.org.id,
      orgSlug: auth.org.slug ?? '',
    },
  });

  if (!customer) {
    throw new NotFoundError('Could not ensure Stripe customer');
  }

  const clerk = getClerkClient();
  await clerk.organizations.updateOrganization(auth.org.id, {
    privateMetadata: {
      ...(auth.org.privateMetadata || {}),
      stripeCustomerId: customer.id,
    },
  });

  return customer;
}
