import { Elements, ElementsConsumer, PaymentElement } from '@stripe/react-stripe-js';
import { useCallback, useState, type FormEvent } from 'react';

import type { Stripe, StripeElements } from '@stripe/stripe-js';
import type { DialogPassThroughProps } from '~/components/dialog/dialog-stack-context';

import { Button } from '~/components/button';
import { Dialog } from '~/components/dialog';
import { Field, Form, useForm } from '~/components/form';
import { Fieldset } from '~/components/form/fieldset';
import { SelectInput } from '~/components/inputs/select-input';
import { Spacer } from '~/components/spacer';
import { P } from '~/components/text';
import { toast } from '~/components/toaster';
import { useInvoices } from '~/features/team/data/use-invoices';
import { usePaymentMethods } from '~/features/team/data/use-payment-methods';
import { api } from '~/utils/api';
import { useAuth } from '~/utils/auth';
import { stripePromise } from '~/utils/stripe';

const ccLabels = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  'american-express': 'American Express',
  diners: 'Diners Club',
  discover: 'Discover',
  maestro: 'Maestro',
};

export function UpgradePlanDialog(props: DialogPassThroughProps) {
  const auth = useAuth();
  const invoices = useInvoices();
  const paymentMethods = usePaymentMethods();

  const defaultPaymentMethod = paymentMethods.data?.data?.find((item) => item.isDefault);
  const hasPaymentMethods =
    !!paymentMethods.data?.data?.length && paymentMethods.data?.data?.length > 0;

  const [formKey, setFormKey] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleAddPaymentMethod = useCallback(
    async ({
      e,
      stripe,
      elements,
    }: {
      e: FormEvent<HTMLFormElement>;
      stripe: Stripe | null;
      elements: StripeElements | null;
    }) => {
      try {
        e.preventDefault();
        setIsSubmitting(true);

        if (!stripe || !elements) {
          throw new Error('Stripe not ready');
        }

        const result = await elements?.submit?.();
        if (result?.error) {
          throw new Error(result.error?.message);
        }

        // Create the SetupIntent and obtain clientSecret
        const res = await api('/team/payment-methods', { method: 'POST' });

        // Confirm the SetupIntent using the details collected by the Payment Element
        const confirmed = await stripe?.confirmSetup?.({
          elements,
          clientSecret: res?.data?.clientSecret,
          redirect: 'if_required',
          confirmParams: {
            return_url: window.location.href,
          },
        });

        if (confirmed.error || !confirmed.setupIntent?.payment_method) {
          throw new Error(confirmed.error?.message || 'Could not confirm setup');
        }

        const paymentMethodId = confirmed.setupIntent.payment_method as string;
        await api(`/team/payment-methods/${paymentMethodId}/set-default`, { method: 'POST' });
        await paymentMethods.refetch();
        setFormKey((key) => key + 1);

        toast.info('Payment method added successfully');
      } catch (e: any) {
        toast.error(e);
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const form = useForm({
    id: 'upgrade-plan-form',
    key: `${formKey}`,
    defaultValues: {
      hasPaymentMethods,
      paymentMethod: defaultPaymentMethod?.id,
    },
    onSubmit: async (data) => {
      try {
        await api(`/team/payment-methods/${data.paymentMethod}/set-default`, { method: 'POST' });
        await api('/team/billing/upgrade', {
          method: 'POST',
          data: {
            price: import.meta.env.VITE_STRIPE_PRICE_ID,
          },
        });
        await invoices.refetch();
        await auth.refresh();
        await props.onClose?.();
        toast.info('Plan upgraded successfully');
      } catch (e: any) {
        toast.error(e);
      }
    },
  });

  if (!hasPaymentMethods) {
    return (
      <Dialog
        {...props}
        title="Add payment method"
        actions={
          <Button variant="primary" form="add-payment-method-form" isLoading={isSubmitting}>
            Add payment method
          </Button>
        }
      >
        <P>Before you can upgrade your plan, you need to add a payment method.</P>

        <Spacer h={16} />
        <Elements stripe={stripePromise} options={{ mode: 'setup', currency: 'aud' }}>
          <ElementsConsumer>
            {({ stripe, elements }) => (
              <form
                id="add-payment-method-form"
                onSubmit={(e) => handleAddPaymentMethod({ e, stripe, elements })}
              >
                <PaymentElement />
              </form>
            )}
          </ElementsConsumer>
        </Elements>
      </Dialog>
    );
  }

  return (
    <Dialog
      {...props}
      title="Upgrade plan"
      actions={
        <Button variant="primary" form={form.id} isLoading={form.formState.isSubmitting}>
          Upgrade
        </Button>
      }
    >
      <div className="flex flex-col gap-2">
        <P>You are about to upgrade your plan to access premium features.</P>
        <P>
          Select a payment method to continue, it will be charged immediately starting the monthly
          billing period. You can cancel at any time.
        </P>
      </div>

      <Spacer h={16} />
      <Form form={form}>
        <Fieldset>
          <Field
            name="paymentMethod"
            label="Payment method"
            Input={SelectInput}
            inputProps={{
              items: paymentMethods.data?.data?.map((item) => ({
                label: ccLabels[item.card?.brand as keyof typeof ccLabels]
                  ? `${ccLabels[item.card?.brand as keyof typeof ccLabels]} ****${item.card?.last4} (Exp. ${item.card?.exp_month}/${item.card?.exp_year})`
                  : `****${item.card?.last4} (Exp. ${item.card?.exp_month}/${item.card?.exp_year})`,
                value: item.id,
              })),
            }}
          />
        </Fieldset>
      </Form>
    </Dialog>
  );
}
