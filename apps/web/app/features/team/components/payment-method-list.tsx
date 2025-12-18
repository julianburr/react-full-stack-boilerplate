import { PaymentMethodListItem } from '~/features/team/components/payment-method-list-item';
import { cn } from '~/ui/lib/utils';

type Props = {
  items: any[];
  className?: string;
};

export function PaymentMethodList({ items, className }: Props) {
  return (
    <div className={cn('flex flex-row flex-wrap gap-2', className)}>
      {items.map((item) => (
        <PaymentMethodListItem key={item.id} data={item} />
      ))}
    </div>
  );
}
