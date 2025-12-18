import type { DialogPassThroughProps } from '~/components/dialog/dialog-stack-context';

import { Button } from '~/components/button';
import { Dialog } from '~/components/dialog';
import { Field, Form, useForm } from '~/components/form';
import { Fieldset } from '~/components/form/fieldset';
import { EmailInput } from '~/components/inputs/email-input';
import { SelectInput } from '~/components/inputs/select-input';
import { toast } from '~/components/toaster';
import { useMembers } from '~/features/team/data/use-members';
import { api } from '~/utils/api';

export function InviteMemberDialog(props: DialogPassThroughProps) {
  const members = useMembers();

  const form = useForm({
    id: 'invite-members-form',
    defaultValues: {
      email: '',
      role: 'org:member',
    },
    onSubmit: async (values) => {
      try {
        await api('/team/members', {
          method: 'POST',
          data: {
            email: values.email,
            role: values.role,
          },
        });
        await members.refetch();
        toast.info('Member invited successfully');
        props.onClose?.();
      } catch (e: any) {
        toast.error(e);
      }
    },
  });

  return (
    <Dialog
      title="Invite member"
      {...props}
      actions={
        <Button variant="primary" form={form.id} isLoading={form.formState.isSubmitting}>
          Invite
        </Button>
      }
    >
      <Form form={form}>
        <Fieldset className="flex-row">
          <Field required name="email" label="Email" Input={EmailInput} />
          <Field
            className="w-[160px]"
            required
            name="role"
            label="Role"
            Input={SelectInput}
            placeholder="Select a role"
            inputProps={{
              items: [
                { label: 'Member', value: 'org:member' },
                { label: 'Admin', value: 'org:admin' },
              ],
            }}
          />
        </Fieldset>
      </Form>
    </Dialog>
  );
}
