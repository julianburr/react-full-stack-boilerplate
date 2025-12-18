import { useAuth } from '@clerk/react-router';

import { AuthedRedirect } from '~/utils/auth/authed-redirect';

export default function AuthComplete() {
  const auth = useAuth();

  if (auth.isLoaded && auth.isSignedIn) {
    return <AuthedRedirect />;
  }

  return <div>Completing auth...</div>;
}
