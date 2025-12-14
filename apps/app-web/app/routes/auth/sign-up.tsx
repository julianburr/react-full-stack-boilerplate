import { useAuth, useClerk } from '@clerk/react-router';
import { useState } from 'react';

import { AuthedRedirect } from '~/utils/auth/authed-redirect';

export default function SignUp() {
  const auth = useAuth();
  const clerk = useClerk();
  console.log('@@@@ auth', auth);

  const [form, setForm] = useState<'sign-up' | 'verify'>('sign-up');

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const emailAddress = formData.get('email') as string;
    const password = formData.get('password') as string;
    try {
      await clerk.client.signUp.create({ emailAddress, password });
      const signUpAttempt = await clerk.client.signUp.prepareEmailAddressVerification();
      console.log({ signUpAttempt });
      setForm('verify');
    } catch (error) {
      console.error('Sign in failed');
      console.log(error);
    }
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const code = formData.get('otp') as string;
    try {
      const verifyAttempt = await clerk.client.signUp.attemptEmailAddressVerification({ code });
      console.log({ verifyAttempt });
      await clerk.setActive({ session: verifyAttempt.createdSessionId });
    } catch (error) {
      console.error('Verify failed');
      console.log(error);
    }
  };

  const handleSignUpWithGoogle = async () => {
    try {
      const signUpAttempt = await clerk.client.signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/auth/oauth',
        redirectUrlComplete: '/auth/oauth/complete',
      });
      console.log({ signUpAttempt });
    } catch (error) {
      console.error('Sign up with Google failed');
      console.log(error);
    }
  };

  if (!auth.isLoaded) {
    return <div>Loading...</div>;
  }

  if (auth.isSignedIn) {
    return <AuthedRedirect />;
  }

  if (form === 'verify') {
    return (
      <div>
        <h1>Verify</h1>
        <form key="verify-form" className="flex flex-col gap-2" onSubmit={handleVerify}>
          <input type="text" name="otp" placeholder="Verification code" />
          <button type="submit">Verify</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1>Sign up</h1>
      <form key="sign-up-form" className="flex flex-col gap-2" onSubmit={handleSignUp}>
        <input type="email" name="email" placeholder="Email" />
        <input type="password" name="password" placeholder="Password" />
        <button type="submit">Sign up</button>

        <hr />
        <button type="button" onClick={handleSignUpWithGoogle}>
          Sign up w/ Google
        </button>
      </form>
    </div>
  );
}
