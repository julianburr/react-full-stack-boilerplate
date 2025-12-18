import { MemberListItem } from '~/features/team/components/member-list-item';
import { cn } from '~/ui/lib/utils';

type Props = {
  items: any[];
  className?: string;
};

export function MemberList({ items, className }: Props) {
  return (
    <div className={cn('flex flex-row flex-wrap gap-2', className)}>
      {items.map((item) => (
        <MemberListItem key={item.id} data={item} />
      ))}
    </div>
  );
}
