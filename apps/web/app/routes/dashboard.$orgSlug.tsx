import * as Sentry from '@sentry/react-router';
import { Navigate, useParams } from 'react-router';

import { useAuth } from '~/utils/auth';

export default function Dashboard() {
  const auth = useAuth();
  const params = useParams();

  const handleClick = async () => {
    Sentry.captureException(new Error('Test error'));
  };

  if (!auth.isLoaded) {
    return <div>Loading...</div>;
  }

  if (!auth.isSignedIn) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return (
    <>
      <pre>Dashboard</pre>
      <button onClick={handleClick}>Test</button>

      <pre>{JSON.stringify({ params, auth }, null, 2)}</pre>
    </>
  );
}
