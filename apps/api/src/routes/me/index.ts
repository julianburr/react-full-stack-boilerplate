import type { FastifyPluginAsync } from 'fastify';
import type Stripe from 'stripe';

import { getClerkClient } from '~/utils/clerk';
import { getStripeClient } from '~/utils/stripe';

const me: FastifyPluginAsync = async (fastify): Promise<void> => {
  /**
   * Get org metadata
   */
  fastify.get('/', async (req) => {
    if (!req.session?.user?.id || !req.session.org?.id) {
      return {
        isSignedIn: true,
        subscription: null,
        user: req.session?.user,
        team: null,
        teamList: [],
        teamInvitations: [],
        flags: req.session?.flags,
      };
    }

    // Get org from Clerk
    // TOOD: paginate
    const clerk = getClerkClient();
    const [orgList, orgInvitations] = await Promise.all([
      clerk.users.getOrganizationMembershipList({ userId: req.session.user.id }),
      clerk.users.getOrganizationInvitationList({ userId: req.session.user.id }),
    ]);

    // Load subscription details from Stripe if it exists
    let customer: Stripe.Customer | Stripe.DeletedCustomer | null = null;
    let subscription: Stripe.Subscription | null = null;

    const customerId = req.session.org.privateMetadata.stripeCustomerId as string;
    if (customerId) {
      const stripe = getStripeClient();
      customer = await stripe.customers.retrieve(customerId, { expand: ['subscriptions'] });
      if ('subscriptions' in customer) {
        subscription = customer.subscriptions?.data?.find((s) => s.status === 'active') || null;
      }
    }

    return {
      isSignedIn: req.session.isSignedIn,
      customer,
      subscription,
      user: req.session.user,
      team: req.session.org,
      teamList: orgList.data,
      teamInvitations: orgInvitations.data,
      flags: req.session.flags,
    };
  });
};

export default me;
