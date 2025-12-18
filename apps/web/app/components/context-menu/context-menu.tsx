import { useRef, type ComponentProps, type PropsWithChildren } from 'react';

import { ContextMenuItem } from './context-menu-item';

import * as C from '~/ui/context-menu';

type Props = ComponentProps<typeof C.ContextMenuContent> &
  PropsWithChildren<{
    items: ComponentProps<typeof ContextMenuItem>['item'][];
  }>;

export function ContextMenu({ children, items, ...props }: Props) {
  const triggerRef = useRef<any>(null);
  const portalTarget = triggerRef.current?.closest('[data-radix-portal]');

  if (!items.length) {
    return children;
  }

  return (
    <C.ContextMenu>
      <C.ContextMenuTrigger ref={triggerRef} asChild>
        {children}
      </C.ContextMenuTrigger>
      <C.ContextMenuContent
        container={portalTarget}
        collisionBoundary={portalTarget}
        collisionPadding={4}
        {...props}
      >
        {items.map((item, index) => (
          <ContextMenuItem key={index} item={item} />
        ))}
      </C.ContextMenuContent>
    </C.ContextMenu>
  );
}
