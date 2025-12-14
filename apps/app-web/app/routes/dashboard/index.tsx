import { useAuth } from '@clerk/react-router';
import { Navigate } from 'react-router';

export default function DashboardIndex() {
  const auth = useAuth();

  if (!auth.isLoaded) {
    return <div>Loading...</div>;
  }

  if (!auth.isSignedIn) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (!auth.orgId) {
    return <Navigate to="/dashboard/setup" replace />;
  }

  return <Navigate to={`/dashboard/${auth.orgSlug}`} replace />;
}
