import { useAuth, useUser } from '@clerk/react-router';
import { Navigate, useParams } from 'react-router';

export default function Dashboard() {
  const auth = useAuth();
  const user = useUser();
  const params = useParams();

  const handleSignOut = async () => {
    await auth.signOut({ redirectUrl: '/auth/sign-in' });
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
      <button onClick={handleSignOut}>Sign out</button>

      <pre>{JSON.stringify({ params, auth, user }, null, 2)}</pre>
    </>
  );
}
