import type { InvalidTokenAuthObject, Organization, SessionAuthObject, User } from '@clerk/backend';
import type Stripe from 'stripe';

import { getFlagsmithClient } from '~/utils/flagsmith';

type Args = {
  auth: SessionAuthObject | InvalidTokenAuthObject;
  user?: User | null;
  org?: Organization | null;
  subscription?: Stripe.Subscription | null;
};

export async function getFlags({ auth, user, org, subscription }: Args) {
  const flagsmith = getFlagsmithClient();

  const res = auth.isAuthenticated
    ? await flagsmith.getIdentityFlags(auth.userId, {
        userId: auth.userId,
        email: user?.emailAddresses[0].emailAddress || null,
        orgId: auth.orgId || null,
        orgName: org?.name || null,
        isPro: !!subscription,
      })
    : await flagsmith.getIdentityFlags('anonymous', {
        userId: null,
        email: null,
        orgId: null,
        orgName: null,
      });

  const flags = Object.keys(res.flags).reduce(
    (acc, key) => {
      const flag = res.flags[key];
      acc[key] = { enabled: flag.enabled, value: flag.value };
      return acc;
    },
    {} as Record<
      string,
      { enabled?: boolean; value?: string | number | boolean | undefined | null }
    >,
  );

  return flags;
}
