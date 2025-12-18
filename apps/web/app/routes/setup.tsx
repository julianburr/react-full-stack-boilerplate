import { Button } from '~/components/button';
import { Field, Form, useForm } from '~/components/form';
import { Fieldset } from '~/components/form/fieldset';
import { EmailInput } from '~/components/inputs/email-input';
import { TextInput } from '~/components/inputs/text-input';
import { Heading } from '~/components/text';
import { toast } from '~/components/toaster';
import { api } from '~/utils/api';
import { useAuth } from '~/utils/auth';

export default function Setup() {
  const auth = useAuth();

  const form = useForm({
    id: 'setup-form',
    defaultValues: {
      name: '',
      email: auth.user?.emailAddresses[0].emailAddress,
    },
    onSubmit: async (values) => {
      try {
        const res = await api('/team', {
          method: 'POST',
          data: {
            name: values.name,
            email: values.email,
          },
        });

        await auth.switchTeam(res.data.id);
      } catch (e: any) {
        toast.error(e);
      }
    },
  });

  return (
    <div className="flex flex-col gap-6 items-center justify-center text-center w-full">
      <Heading level={1} size="xxl" className="text-balance">
        Create a new team
      </Heading>
      <Form form={form}>
        <Fieldset>
          <Field required name="name" label="Team name" Input={TextInput} />
          <Field
            required
            name="email"
            label="Email"
            description="This email will be used for any team specific communications, e.g. billing, member changes, etc"
            Input={EmailInput}
          />
          <Button
            variant="primary"
            size="lg"
            form={form.id}
            isLoading={form.formState.isSubmitting}
            className="w-full"
          >
            Create team
          </Button>
        </Fieldset>
      </Form>
    </div>
  );
}
