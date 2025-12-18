import { Elements, ElementsConsumer, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe, type Stripe, type StripeElements } from '@stripe/stripe-js';
import { useCallback, useState } from 'react';

import type { FormEvent } from 'react';
import type { DialogPassThroughProps } from '~/components/dialog/dialog-stack-context';

import { Button } from '~/components/button';
import { Dialog } from '~/components/dialog';
import { toast } from '~/components/toaster';
import { usePaymentMethods } from '~/features/team/data/use-payment-methods';
import { api } from '~/utils/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

export function AddPaymentMethodDialog(props: DialogPassThroughProps) {
  const paymentMethods = usePaymentMethods();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = useCallback(
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

        toast.info('Payment method added successfully');
        await props.onClose?.();
      } catch (e: any) {
        toast.error(e);
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

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
      <Elements stripe={stripePromise} options={{ mode: 'setup', currency: 'aud' }}>
        <ElementsConsumer>
          {({ stripe, elements }) => (
            <form
              id="add-payment-method-form"
              onSubmit={(e) => handleSubmit({ e, stripe, elements })}
            >
              <PaymentElement />
            </form>
          )}
        </ElementsConsumer>
      </Elements>
    </Dialog>
  );
}
