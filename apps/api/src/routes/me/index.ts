import type { FastifyPluginAsync } from 'fastify';
import type Stripe from 'stripe';

import { getAuth } from '~/utils/auth';
import { getClerkClient } from '~/utils/clerk';
import { NotFoundError } from '~/utils/errors';
import { getStripeClient } from '~/utils/stripe';

const me: FastifyPluginAsync = async (fastify): Promise<void> => {
  /**
   * Get org metadata
   */
  fastify.get('/', async (req) => {
    const auth = getAuth(req);

    // If user is not authenticated, return null
    if (!auth.isAuthenticated || !auth.userId) {
      return {
        isSignedIn: false,
        subscription: null,
        user: null,
        team: null,
        teamList: [],
        teamInvitations: [],
      };
    }

    // Get user & organisation from from Clerk
    const clerk = getClerkClient();
    const user = await clerk.users.getUser(auth.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!auth.orgId) {
      return {
        isSignedIn: true,
        subscription: null,
        user,
        team: null,
        teamList: [],
        teamInvitations: [],
      };
    }

    // Get org from Clerk
    // TOOD: paginate
    const [org, orgList, orgInvitations] = await Promise.all([
      clerk.organizations.getOrganization({ organizationId: auth.orgId }),
      clerk.users.getOrganizationMembershipList({ userId: auth.userId }),
      clerk.users.getOrganizationInvitationList({ userId: auth.userId }),
    ]);

    if (!org) {
      throw new NotFoundError('Organization not found');
    }
    // Load subscription details from Stripe if it exists
    let customer: Stripe.Customer | Stripe.DeletedCustomer | null = null;
    let subscription: Stripe.Subscription | null = null;

    const customerId = org.privateMetadata.stripeCustomerId as string;
    if (customerId) {
      const stripe = getStripeClient();
      customer = await stripe.customers.retrieve(customerId, { expand: ['subscriptions'] });
      if ('subscriptions' in customer) {
        subscription = customer.subscriptions?.data?.find((s) => s.status === 'active') || null;
      }
    }

    const data = {
      isSignedIn: auth.isAuthenticated,
      customer,
      subscription,
      user,
      team: org,
      teamList: orgList.data,
      teamInvitations: orgInvitations.data,
    };

    return { data };
  });
};

export default me;
