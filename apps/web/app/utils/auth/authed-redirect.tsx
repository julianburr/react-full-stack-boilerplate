import { Navigate } from 'react-router';

import { useAuth } from './auth-context';

export function AuthedRedirect() {
  const auth = useAuth();
  if (!auth.orgSlug) {
    return <Navigate to="/setup" replace />;
  }

  return <Navigate to={`/dashboard/${auth.orgSlug}`} replace />;
}
