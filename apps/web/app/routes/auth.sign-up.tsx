import { useAuth, useClerk } from '@clerk/react-router';
import { GoogleLogoIcon } from '@phosphor-icons/react';
import { Link, useNavigate } from 'react-router';

import { Button } from '~/components/button';
import { Field, Form, useForm } from '~/components/form';
import { Hr } from '~/components/hr';
import { EmailInput } from '~/components/inputs/email-input';
import { PasswordInput } from '~/components/inputs/password-input';
import { Heading, P } from '~/components/text';
import { toast } from '~/components/toaster';
import { AuthedRedirect } from '~/utils/auth/authed-redirect';

export default function SignUp() {
  const auth = useAuth();
  const clerk = useClerk();
  const navigate = useNavigate();

  const form = useForm({
    id: 'sign-up-form',
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      try {
        await clerk.client.signUp.create({ emailAddress: values.email, password: values.password });
        await clerk.client.signUp.prepareEmailAddressVerification();
        navigate('/auth/sign-up/verify');
      } catch (e: any) {
        toast.error(e);
      }
    },
  });

  const handleSignUpWithGoogle = async () => {
    try {
      await clerk.client.signUp.authenticateWithRedirect({
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
        Create an account to get started
      </Heading>

      <Form form={form} className="flex flex-col gap-2 text-left w-full">
        <Button variant="primary" size="lg" width="full" onClick={handleSignUpWithGoogle}>
          <span className="flex flex-row items-center gap-3">
            <GoogleLogoIcon />
            <span>Sign in with Google</span>
          </span>
        </Button>
        <Hr text="or" />
        <Field name="email" label="Email" Input={EmailInput} />
        <Field name="password" label="Password" Input={PasswordInput} />
        width="full"
        <Button
          variant="primary"
          size="lg"
          form={form.id}
          isLoading={form.formState.isSubmitting}
          className="w-full"
        >
          Sign in
        </Button>
      </Form>

      <P size="sm">
        Already have an account yet? <Link to="/auth/sign-in">Sign in</Link>
      </P>
    </div>
  );
}
