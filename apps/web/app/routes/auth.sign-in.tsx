import { useAuth, useClerk } from '@clerk/react-router';
import { GoogleLogoIcon } from '@phosphor-icons/react';
import { Link } from 'react-router';

import { Button } from '~/components/button';
import { Field, Form, useForm } from '~/components/form';
import { Fieldset } from '~/components/form/fieldset';
import { Hr } from '~/components/hr';
import { EmailInput } from '~/components/inputs/email-input';
import { PasswordInput } from '~/components/inputs/password-input';
import { Heading, P } from '~/components/text';
import { toast } from '~/components/toaster';
import { AuthedRedirect } from '~/utils/auth/authed-redirect';

export default function SignIn() {
  const auth = useAuth();
  const clerk = useClerk();

  const form = useForm({
    id: 'sign-in-form',
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      try {
        const signInAttempt = await clerk.client.signIn.create({
          identifier: values.email,
          password: values.password,
        });
        await clerk.setActive({ session: signInAttempt.createdSessionId });
      } catch (e: any) {
        toast.error(e);
      }
    },
  });

  const handleSignInWithGoogle = async () => {
    try {
      await clerk.client.signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/auth/oauth',
        redirectUrlComplete: '/auth/oauth/complete',
      });
    } catch (e: any) {
      toast.error(e);
    }
  };

  if (!auth.isLoaded) {
    return <div>Loading...</div>;
  }

  if (auth.isSignedIn) {
    return <AuthedRedirect />;
  }

  return (
    <div className="flex flex-col gap-6 items-center justify-center text-center w-full">
      <Heading level={1} size="xxl" className="text-balance">
        Sign into your account
      </Heading>

      <Form form={form}>
        <Fieldset>
          <Button variant="primary" size="lg" width="full" onClick={handleSignInWithGoogle}>
            <span className="flex flex-row items-center gap-3">
              <GoogleLogoIcon />
              <span>Sign in with Google</span>
            </span>
          </Button>
          <Hr text="or" />

          <Field name="email" label="Email" Input={EmailInput} />
          <Field name="password" label="Password" Input={PasswordInput} />
          <Button
            variant="primary"
            size="lg"
            form={form.id}
            isLoading={form.formState.isSubmitting}
            className="w-full"
          >
            Sign in
          </Button>
        </Fieldset>
      </Form>

      <P size="sm">
        Don't have an account yet? <Link to="/auth/sign-up">Sign up</Link>
      </P>
    </div>
  );
}
