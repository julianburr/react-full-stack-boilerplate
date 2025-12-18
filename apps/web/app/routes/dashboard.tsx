import { Navigate } from 'react-router';

import { useAuth } from '~/utils/auth';

export default function DashboardIndex() {
  const auth = useAuth();
  return <Navigate to={`/dashboard/${auth.team?.slug}`} replace />;
}
