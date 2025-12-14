import { useAuth } from '@clerk/react-router';
import { Navigate } from 'react-router';

export function AuthedRedirect() {
  const auth = useAuth();
  if (!auth.orgSlug) {
    return <Navigate to="/dashboard/setup" replace />;
  }

  return <Navigate to={`/dashboard/${auth.orgSlug}`} replace />;
}
