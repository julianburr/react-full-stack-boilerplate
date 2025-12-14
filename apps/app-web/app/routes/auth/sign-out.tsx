import { useClerk } from '@clerk/react-router';
import { useEffect } from 'react';

export default function SignOut() {
  const clerk = useClerk();

  useEffect(() => {
    clerk.signOut({ redirectUrl: '/auth/sign-in' });
  }, []);

  return <div>Signing out...</div>;
}
