import { Navigate } from 'react-router';

import { useAuth, useFlags } from '~/utils/auth';

export default function Dashboard() {
  const auth = useAuth();
  const flags = useFlags(['test-feature-1', 'test-feature-2'] as const);

  if (!auth.isLoaded) {
    return <div>Loading...</div>;
  }

  if (!auth.isSignedIn) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return (
    <>
      <pre>Dashboard</pre>
      <pre>Feature 1: {flags['test-feature-1'].enabled ? 'Enabled' : 'Disabled'}</pre>
      <pre>Feature 2: {flags['test-feature-2'].enabled ? 'Enabled' : 'Disabled'}</pre>
    </>
  );
}
