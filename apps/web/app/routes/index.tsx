import { Navigate } from 'react-router';

import { useAuth } from '~/utils/auth';

export default function Home() {
  const auth = useAuth();

  if (!auth.isLoaded) {
    return <div>Loading...</div>;
  }

  if (!auth.isSignedIn) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (!auth.orgSlug) {
    return <Navigate to="/setup" replace />;
  }

  return <Navigate to={`/dashboard/${auth.orgSlug}`} replace />;
}
