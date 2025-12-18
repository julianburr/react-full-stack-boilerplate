import { InviteListItem } from '~/features/team/components/invite-list-item';
import { cn } from '~/ui/lib/utils';

type Props = {
  items: any[];
  className?: string;
};

export function InviteList({ items, className }: Props) {
  return (
    <div className={cn('flex flex-row flex-wrap gap-2', className)}>
      {items.map((item) => (
        <InviteListItem key={item.id} data={item} />
      ))}
    </div>
  );
}
