import type { DialogPassThroughProps } from '~/components/dialog/dialog-stack-context';

import { Button } from '~/components/button';
import { Dialog } from '~/components/dialog';
import { Field, Form, useForm } from '~/components/form';
import { Fieldset } from '~/components/form/fieldset';
import { EmailInput } from '~/components/inputs/email-input';
import { TextInput } from '~/components/inputs/text-input';
import { toast } from '~/components/toaster';
import { api } from '~/utils/api';
import { useAuth } from '~/utils/auth';

export function CreateTeamDialog(props: DialogPassThroughProps) {
  const auth = useAuth();

  const form = useForm({
    id: 'create-team-form',
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
        props.onClose?.();
      } catch (e: any) {
        toast.error(e);
      }
    },
  });

  return (
    <Dialog
      {...props}
      title="Create a new team"
      actions={
        <Button variant="primary" form={form.id} isLoading={form.formState.isSubmitting}>
          Create team
        </Button>
      }
    >
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
        </Fieldset>
      </Form>
    </Dialog>
  );
}
