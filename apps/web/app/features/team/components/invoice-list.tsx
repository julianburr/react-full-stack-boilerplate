import { InvoiceListItem } from '~/features/team/components/invoice-list-item';
import { cn } from '~/ui/lib/utils';

type Props = {
  items: any[];
  className?: string;
};

export function InvoiceList({ items, className }: Props) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {items.map((item) => (
        <InvoiceListItem key={item.id} data={item} />
      ))}
    </div>
  );
}
