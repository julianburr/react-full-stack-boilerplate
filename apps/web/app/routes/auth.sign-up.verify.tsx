import { useAuth, useClerk } from '@clerk/react-router';
import { Link } from 'react-router';

import { Button } from '~/components/button';
import { Field, Form, useForm } from '~/components/form';
import { OtpInput } from '~/components/inputs/otp-input';
import { Heading, P } from '~/components/text';
import { toast } from '~/components/toaster';
import { AuthedRedirect } from '~/utils/auth/authed-redirect';

export default function SignUp() {
  const auth = useAuth();
  const clerk = useClerk();

  const form = useForm({
    id: 'sign-up-verify-form',
    defaultValues: {
      otp: '',
    },
    onSubmit: async (values) => {
      try {
        const verifyAttempt = await clerk.client.signUp.attemptEmailAddressVerification({
          code: values.otp,
        });
        await clerk.setActive({ session: verifyAttempt.createdSessionId });
      } catch (e: any) {
        toast.error(e);
      }
    },
  });

  if (!auth.isLoaded) {
    return <div>Loading...</div>;
  }

  if (auth.isSignedIn) {
    return <AuthedRedirect />;
  }

  return (
    <div className="flex flex-col items-center justify-center text-center w-full">
      <Heading level={1} size="xxl" className="text-balance">
        Verify your email address
      </Heading>
      <P>
        We've sent a verification code to your email address. Enter the code below to continue your
        account setup.
      </P>

      <div className="flex flex-col gap-6">
        <Form form={form} className="flex flex-col gap-2 text-left w-full">
          <Field name="otp" label="Verification code" Input={OtpInput} />
          <Button
            variant="primary"
            size="lg"
            form={form.id}
            isLoading={form.formState.isSubmitting}
            className="w-full"
          >
            Verify
          </Button>
        </Form>

        <P size="sm">
          Had an epiphany? Then head back to the <Link to="/auth/sign-in">sign in</Link> page
        </P>
      </div>
    </div>
  );
}
