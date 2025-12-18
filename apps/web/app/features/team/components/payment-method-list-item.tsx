import { CreditCardIcon, DotsThreeVerticalIcon } from '@phosphor-icons/react';
import { useCallback, useMemo } from 'react';

import AmericanExpressIcon from '~/assets/cards/american-express.svg?react';
import DinersIcon from '~/assets/cards/diners.svg?react';
import DiscoverIcon from '~/assets/cards/discover.svg?react';
import MaestroIcon from '~/assets/cards/maestro.svg?react';
import MastercardIcon from '~/assets/cards/mastercard.svg?react';
import VisaIcon from '~/assets/cards/visa.svg?react';
import { Button } from '~/components/button';
import { DropdownMenu } from '~/components/dropdown-menu';
import { Text } from '~/components/text';
import { toast } from '~/components/toaster';
import { usePaymentMethods } from '~/features/team/data/use-payment-methods';
import { api } from '~/utils/api';

const cardIcons = {
  visa: <VisaIcon className="w-full h-auto rounded-sm" />,
  mastercard: <MastercardIcon className="w-full h-auto" />,
  'american-express': <AmericanExpressIcon className="w-full h-auto" />,
  diners: <DinersIcon className="w-full h-auto" />,
  discover: <DiscoverIcon className="w-full h-auto" />,
  maestro: <MaestroIcon className="w-full h-auto" />,
  __fallback: <CreditCardIcon className="w-full h-auto" />,
};

type Props = {
  data: any;
};

export function PaymentMethodListItem({ data }: Props) {
  const paymentMethods = usePaymentMethods();

  const handleSetAsDefault = useCallback(async () => {
    try {
      await api(`/team/payment-methods/${data?.id}/set-default`, { method: 'POST' });
      await paymentMethods.refetch();
      toast.info('Default payment method updated');
    } catch (e: any) {
      toast.error(e);
    }
  }, [data?.id]);

  const handleRemove = useCallback(async () => {
    try {
      await api(`/team/payment-methods/${data?.id}`, { method: 'DELETE' });
      await paymentMethods.refetch();
      toast.info('Payment method removed successfully');
    } catch (e: any) {
      toast.error(e);
    }
  }, [data?.id]);

  const cardIcon = useMemo(() => {
    return cardIcons[data?.card?.brand as keyof typeof cardIcons] || cardIcons.__fallback;
  }, [data?.card?.brand]);

  return (
    <div className="flex w-full max-w-[320px] bg-[#333]/10 p-3 rounded-md flex-row gap-2 items-center relative">
      <span className="flex items-center justify-center w-9 h-9">{cardIcon}</span>
      <div className="flex flex-1 flex-col">
        <Text strength="strong">
          **** {data?.card?.last4}
          {data?.isDefault ? ' (default)' : ''}
        </Text>
        <Text size="xs">
          Exp. {data?.card?.exp_month}/{data?.card?.exp_year}
        </Text>
      </div>

      {!data?.isDefault && (
        <DropdownMenu
          items={[
            {
              label: 'Set as default',
              onClick: handleSetAsDefault,
            },
            {
              label: 'Remove',
              onClick: handleRemove,
            },
          ]}
        >
          <Button icon={<DotsThreeVerticalIcon />} variant="ghost" />
        </DropdownMenu>
      )}
    </div>
  );
}
