import { useEffect, useState, type ComponentProps, type PropsWithChildren } from 'react';

import { DropdownMenuItem } from './dropdown-menu-item';

import * as D from '~/ui/dropdown-menu';

type Props = ComponentProps<typeof D.DropdownMenuContent> &
  PropsWithChildren<{
    items: ComponentProps<typeof DropdownMenuItem>['item'][];
    onOpenChange?: ComponentProps<typeof D.DropdownMenu>['onOpenChange'];
  }>;

export function DropdownMenu({ children, items, onOpenChange, ...props }: Props) {
  // HACK: using state instead of refs because the initialisation with refs was buggy, where it seems like
  // a race condition when the trigger ref was actually being set :|
  const [triggerRef, setTriggerRef] = useState<HTMLElement | null | undefined>(undefined);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | undefined>(undefined);
  useEffect(() => {
    setPortalTarget(triggerRef?.closest('[data-radix-portal]') as any);
  }, [triggerRef]);

  if (!items.length) {
    return children;
  }

  return (
    <D.DropdownMenu onOpenChange={onOpenChange}>
      <D.DropdownMenuTrigger asChild ref={setTriggerRef}>
        {children}
      </D.DropdownMenuTrigger>
      <D.DropdownMenuContent
        container={portalTarget}
        collisionBoundary={portalTarget}
        collisionPadding={4}
        {...props}
      >
        {items.map((item, index) => (
          <DropdownMenuItem key={index} item={item} />
        ))}
      </D.DropdownMenuContent>
    </D.DropdownMenu>
  );
}
