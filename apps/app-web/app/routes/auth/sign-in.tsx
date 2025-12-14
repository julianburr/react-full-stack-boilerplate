import { useAuth, useClerk } from '@clerk/react-router';

import { AuthedRedirect } from '~/utils/auth/authed-redirect';

export default function SignIn() {
  const auth = useAuth();
  const clerk = useClerk();
  console.log('@@@@ auth', auth);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const emailAddress = formData.get('email') as string;
    const password = formData.get('password') as string;
    try {
      const signInAttempt = await clerk.client.signIn.create({
        identifier: emailAddress,
        password,
      });
      console.log({ signInAttempt });
      await clerk.setActive({ session: signInAttempt.createdSessionId });
    } catch (error) {
      console.error('Sign in failed');
      console.log(error);
    }
  };

  const handleSignInWithGoogle = async () => {
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

  return (
    <div>
      <h1>Sign in</h1>
      <form className="flex flex-col gap-2" onSubmit={handleSignIn}>
        <input type="email" name="email" placeholder="Email" />
        <input type="password" name="password" placeholder="Password" />
        <button type="submit">Sign in</button>

        <hr />
        <button type="button" onClick={handleSignInWithGoogle}>
          Sign in w/ Google
        </button>
      </form>
    </div>
  );
}
