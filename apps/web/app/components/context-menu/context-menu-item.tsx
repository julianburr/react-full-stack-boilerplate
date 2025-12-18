import { Link } from 'react-router';

import type { MouseEvent, ReactNode } from 'react';
import type { To } from 'react-router';

import * as C from '~/ui/context-menu';

type Item =
  | { type: 'separator' }
  | { icon?: ReactNode; label: ReactNode; onClick: undefined | ((e: MouseEvent) => void) }
  | { icon?: ReactNode; label: ReactNode; to: To };

type Props = {
  item: Item;
};

export function ContextMenuItem({ item }: Props) {
  if ('type' in item) {
    return <C.ContextMenuSeparator />;
  }

  if ('to' in item) {
    return (
      <C.ContextMenuItem asChild className="min-w-[140px]">
        <Link to={item.to} className="font-[350]! hover:no-underline!">
          {item.icon && (
            <span className="*:w-[14px]! *:h-auto! *:text-[#393939]! *:opacity-[0.40]!">
              {item.icon}
            </span>
          )}
          <span>{item.label}</span>
        </Link>
      </C.ContextMenuItem>
    );
  }

  return (
    <C.ContextMenuItem onClick={item.onClick}>
      {item.icon && (
        <span className="*:w-[14px]! *:h-auto! *:text-[#393939]! *:opacity-[0.40]!">
          {item.icon}
        </span>
      )}
      <span>{item.label}</span>
    </C.ContextMenuItem>
  );
}
