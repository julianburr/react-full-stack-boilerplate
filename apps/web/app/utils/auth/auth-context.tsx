import { useClerk, useAuth as useClerkAuth } from '@clerk/react-router';
import * as Sentry from '@sentry/react-router';
import { createContext, use, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import type * as C from '@clerk/react-router/server';
import type { PropsWithChildren } from 'react';

import { toast } from '~/components/toaster';
import { api } from '~/utils/api';

type AuthContextValue =
  | {
      isSignedIn: true;
      user: C.User;
      team: C.Organization;
      teamList: C.OrganizationMembership[];
      teamInvitations: C.OrganizationInvitation[];
      customer: any | null;
      subscription: any | null;
      flags: null | Record<string, any>;
      isSwitching: boolean;
      refresh: () => void;
      switchTeam: (teamId: string) => void;
    }
  | {
      isSignedIn: false;
      user: null;
      team: null;
      teamList: [];
      teamInvitations: [];
      customer: null;
      subscription: null;
      flags: null | Record<string, any>;
      isSwitching: boolean;
      refresh: () => void;
      switchTeam: (teamId: string) => void;
    };

export const AuthContext = createContext<AuthContextValue>({
  isSignedIn: false,
  user: null,
  team: null,
  teamList: [],
  teamInvitations: [],
  customer: null,
  subscription: null,
  flags: null,
  isSwitching: false,
  refresh: () => {},
  switchTeam: () => {},
});

export function AuthProvider({
  children,
  value: initialValue,
}: PropsWithChildren<{ value: AuthContextValue }>) {
  const clerk = useClerk();
  const navigate = useNavigate();

  const [isSwitching, setIsSwitching] = useState(false);
  const [value, setValue] = useState(initialValue);
  const refresh = useCallback(async () => {
    const me = await api('/me');

    await clerk.setActive({ organization: me?.org });
    await clerk.session?.reload();

    api.setGetToken(clerk.session?.getToken);
    setValue(me);
  }, []);

  const switchTeam = useCallback(async (teamId: string) => {
    try {
      setIsSwitching(true);
      await clerk.setActive({ organization: teamId });
      await clerk.session?.reload();
      const me = await api('/me');

      api.setGetToken(clerk.session?.getToken);
      setValue(me);

      const newTeam = me?.teamList?.find((t: any) => t.organization.id === teamId);
      await navigate(`/dashboard/${newTeam?.organization?.slug}`);
    } catch (e: any) {
      toast.error(e);
    } finally {
      setIsSwitching(false);
    }
  }, []);

  const extendedValue = useMemo(
    () => ({ ...value, isSwitching, refresh, switchTeam }),
    [value, isSwitching, refresh, switchTeam],
  );

  const sessionContext = useMemo(() => {
    return {
      isSignedIn: value.isSignedIn,
      userId: value.user?.id,
      userEmail: value.user?.emailAddresses[0].emailAddress,
      orgId: value.team?.id,
      orgSlug: value.team?.slug,
      orgName: value.team?.name,
      flags: value.flags,
    };
  }, [value]);

  Sentry.setContext('session', sessionContext);
  Sentry.setUser({
    id: value.user?.id,
    email: value.user?.emailAddresses[0].emailAddress,
    firstName: value.user?.firstName,
    lastName: value.user?.lastName,
    orgId: value.team?.id,
    orgSlug: value.team?.slug,
    orgName: value.team?.name,
  });

  return <AuthContext value={extendedValue}>{children}</AuthContext>;
}

export function useAuth() {
  const clerk = useClerkAuth();
  const custom = use(AuthContext);

  api.setUrl(import.meta.env.VITE_API_URL!);
  api.setGetToken(clerk.getToken);

  console.log({ clerk, custom });

  return useMemo(() => ({ ...clerk, ...custom }), [clerk, custom]);
}

type FlagKeys = 'test-feature-1' | 'test-feature-2';

type Flag = {
  value?: string;
  enabled?: boolean;
};

export function useFlags<T extends FlagKeys[]>(keys: T) {
  const auth = useAuth();

  const memKey = keys.join('|');
  return useMemo(
    () =>
      keys.reduce(
        (acc, key) => {
          acc[key as T[number]] = auth.flags?.[key] || { enabled: false, value: undefined };
          return acc;
        },
        {} as Record<T[number], Flag>,
      ),
    [memKey],
  );
}
