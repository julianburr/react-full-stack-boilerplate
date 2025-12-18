import { useOrganization } from '@clerk/react-router';
import { PlusIcon } from '@phosphor-icons/react';

import { Button } from '~/components/button';
import { useDialog } from '~/components/dialog';
import { Field, Form, useForm } from '~/components/form';
import { Fieldset } from '~/components/form/fieldset';
import { EmailInput } from '~/components/inputs/email-input';
import { TextInput } from '~/components/inputs/text-input';
import { Spacer } from '~/components/spacer';
import { EmptyState } from '~/components/states/empty-state';
import { LoadingState } from '~/components/states/loading-state';
import { Heading, P, Text } from '~/components/text';
import { toast } from '~/components/toaster';
import { InviteList } from '~/features/team/components/invite-list';
import { InvoiceList } from '~/features/team/components/invoice-list';
import { MemberList } from '~/features/team/components/member-list';
import { PaymentMethodList } from '~/features/team/components/payment-method-list';
import { useInvoices } from '~/features/team/data/use-invoices';
import { useMembers } from '~/features/team/data/use-members';
import { usePaymentMethods } from '~/features/team/data/use-payment-methods';
import { AddPaymentMethodDialog } from '~/features/team/dialogs/add-payment-method-dialog';
import { DowngradePlanDialog } from '~/features/team/dialogs/downgrade-plan-dialog';
import { InviteMemberDialog } from '~/features/team/dialogs/invite-member-dialog';
import { UpgradePlanDialog } from '~/features/team/dialogs/upgrade-plan-dialog';
import { api } from '~/utils/api';
import { useAuth } from '~/utils/auth';

export default function TeamSettings() {
  const auth = useAuth();
  const org = useOrganization();

  const members = useMembers();
  const invoices = useInvoices();
  const paymentMethods = usePaymentMethods();

  const upgradePlanDialog = useDialog(UpgradePlanDialog);
  const downgradePlanDialog = useDialog(DowngradePlanDialog);
  const inviteMemberDialog = useDialog(InviteMemberDialog);
  const addPaymentMethodDialog = useDialog(AddPaymentMethodDialog);

  const isPro = !!auth.subscription;
  const isCancelled = !!auth.subscription?.cancel_at;

  const form = useForm({
    id: 'team-settings-form',
    defaultValues: {
      name: auth.team?.name,
      email: auth.team?.privateMetadata?.email,
    },
    onSubmit: async (values) => {
      try {
        await api(`/team`, {
          method: 'PATCH',
          data: {
            name: values.name,
            email: values.email,
          },
        });
        toast.info('Team settings updated successfully');
      } catch (e: any) {
        toast.error(e);
      }
    },
  });

  const isLoading =
    !org.isLoaded || members.isLoading || invoices.isLoading || paymentMethods.isLoading;
  if (isLoading) {
    return <LoadingState message="Loading team settings..." />;
  }

  return (
    <>
      <Heading level={1} size="xxl">
        Team Settings
      </Heading>

      <Spacer h={16} />
      <Form form={form} className="flex w-full max-w-[340px]">
        <Fieldset>
          <Field name="name" label="Team name" Input={TextInput} required />
          <Field
            name="email"
            label="Email"
            Input={EmailInput}
            description="This email will be used for any team specific communications, e.g. billing, member changes, etc"
            required
          />
          <Button variant="primary" form={form.id} isLoading={form.formState.isSubmitting}>
            Update team
          </Button>
        </Fieldset>
      </Form>

      <Spacer h={40} />
      <div className="flex flex-row items-center gap-6">
        <Heading level={2} size="xl">
          Members
        </Heading>
        <Button icon={<PlusIcon />} variant="grey" onClick={() => inviteMemberDialog.open()} />
      </div>
      <Spacer h={4} />
      <MemberList items={members.data?.data?.members || []} />

      {!!members.data?.data?.invitations?.length && (
        <>
          <Spacer h={12} />
          <Heading level={2} size="lg">
            Pending invites
          </Heading>
          <Spacer h={4} />
          <InviteList items={members.data?.data?.invitations || []} />
        </>
      )}

      <Spacer h={40} />
      <Heading level={2} size="xl">
        Plans & billing
      </Heading>

      <Spacer h={4} />
      <div className="flex flex-row gap-2">
        <button
          data-active={!isPro}
          onClick={isPro ? () => downgradePlanDialog.open() : undefined}
          className="flex flex-col w-full max-w-[280px] bg-[#333]/10 p-4 py-8 rounded-md relative text-center justify-center hover:bg-[#333]/16 focus:bg-[#333]/16 data-[active=true]:bg-[#333] data-[active=true]:hover:bg-[#333] data-[active=true]:focus:bg-[#333] data-[active=true]:text-[#fff]"
        >
          <Text strength="strong" size="lg">
            Hobby
          </Text>
          <Text>Forever free</Text>
        </button>
        <button
          data-active={!!isPro}
          onClick={!isPro ? () => upgradePlanDialog.open() : undefined}
          className="flex flex-col w-full max-w-[280px] bg-[#333]/10 p-4 py-8 rounded-md relative text-center justify-center hover:bg-[#333]/16 focus:bg-[#333]/16 data-[active=true]:bg-[#333] data-[active=true]:hover:bg-[#333] data-[active=true]:focus:bg-[#333] data-[active=true]:text-[#fff]"
        >
          <Text strength="strong" size="lg">
            Pro
          </Text>
          <Text>A$9 / month</Text>
        </button>
      </div>

      {isCancelled && (
        <P>
          Your plan will be cancelled on{' '}
          {new Date(auth.subscription.cancel_at * 1000).toLocaleDateString()} at the end of the
          current billing period. You can re-subscribe to the Pro plan to un-cancel and continue the
          current subscription.
        </P>
      )}

      <Spacer h={18} />
      <div className="flex flex-row items-center gap-6">
        <Heading level={2} size="lg">
          Payment methods
        </Heading>
        <Button icon={<PlusIcon />} variant="grey" onClick={() => addPaymentMethodDialog.open()} />
      </div>
      <Spacer h={4} />
      {paymentMethods.data?.data?.length ? (
        <PaymentMethodList items={paymentMethods.data?.data || []} />
      ) : (
        <EmptyState message="No payment methods found" />
      )}

      {!!invoices.data?.data?.length && (
        <>
          <Spacer h={18} />
          <Heading level={2} size="lg">
            Invoices
          </Heading>
          <Spacer h={4} />
          <InvoiceList items={invoices.data?.data || []} />
        </>
      )}

      <Spacer h={20} />
    </>
  );
}
