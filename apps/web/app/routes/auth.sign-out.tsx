import { useClerk } from '@clerk/react-router';
import { useEffect } from 'react';

import { LoadingState } from '~/components/states/loading-state';

export default function SignOut() {
  const clerk = useClerk();

  useEffect(() => {
    clerk.signOut({ redirectUrl: '/auth/sign-in' });
  }, []);

  return <LoadingState message="Signing out..." />;
}
