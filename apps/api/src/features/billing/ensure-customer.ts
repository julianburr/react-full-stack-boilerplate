import type { Organization } from '@clerk/backend';
import type { ensureAuth } from '~/utils/auth';

import { getClerkClient } from '~/utils/clerk';
import { BadRequestError, NotFoundError } from '~/utils/errors';
import { getStripeClient } from '~/utils/stripe';

type Args = {
  auth: ReturnType<typeof ensureAuth>;
  org: Organization;
};

export async function ensureCustomer({ auth, org }: Args) {
  if (!org) {
    throw new BadRequestError('Organization not found');
  }

  const email = org.privateMetadata.email as string;
  const customerId = org.privateMetadata.stripeCustomerId as string;
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
    name: org.name,
    metadata: {
      orgId: auth.orgId,
      orgSlug: auth.orgSlug ?? '',
    },
  });

  if (!customer) {
    throw new NotFoundError('Could not ensure Stripe customer');
  }

  const clerk = getClerkClient();
  await clerk.organizations.updateOrganization(org.id, {
    privateMetadata: {
      ...(org.privateMetadata || {}),
      stripeCustomerId: customer.id,
    },
  });

  return customer;
}
