import { useClerk, useAuth as useClerkAuth } from '@clerk/react-router';
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

    await clerk.setActive({ organization: me.data?.org });
    await clerk.session?.reload();

    api.setGetToken(clerk.session?.getToken);
    setValue(me.data);
  }, []);

  const switchTeam = useCallback(async (teamId: string) => {
    try {
      setIsSwitching(true);
      await clerk.setActive({ organization: teamId });
      await clerk.session?.reload();
      const me = await api('/me');

      api.setGetToken(clerk.session?.getToken);
      setValue(me.data);

      const newTeam = me.data?.teamList?.find((t: any) => t.organization.id === teamId);
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
  return <AuthContext value={extendedValue}>{children}</AuthContext>;
}

export function useAuth() {
  const clerk = useClerkAuth();
  const custom = use(AuthContext);

  api.setUrl(import.meta.env.VITE_API_URL!);
  api.setGetToken(clerk.getToken);

  return { ...clerk, ...custom };
}
