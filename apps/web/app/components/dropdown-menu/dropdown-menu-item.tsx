import { CheckIcon } from '@phosphor-icons/react';
import { useMemo, type MouseEvent, type ReactNode } from 'react';
import { Link } from 'react-router';

import type { To } from 'react-router';

import * as D from '~/ui/dropdown-menu';

type Item =
  | { type: 'separator' }
  | {
      icon?: ReactNode;
      checked?: boolean;
      label: ReactNode;
      description?: ReactNode;
      onClick?: (e: MouseEvent) => void;
      disabled?: boolean;
    }
  | {
      icon?: ReactNode;
      checked?: boolean;
      label: ReactNode;
      description?: ReactNode;
      to: To;
      target?: string;
      onClick?: (e: MouseEvent) => void;
      disabled?: boolean;
    };

type Props = {
  item: Item;
};

export function DropdownMenuItem({ item }: Props) {
  const icon = useMemo(
    () =>
      'checked' in item ? (
        <span className="p-[1px] *:w-[1em]! *:h-auto! *:text-[currentColor]">
          <CheckIcon
            weight="bold"
            data-invisible={!item.checked}
            className="data-[invisible=true]:invisible"
            aria-label={item.checked ? 'Selected' : 'Not Selected'}
          />
        </span>
      ) : 'icon' in item && item.icon ? (
        <span className="p-[1px] *:w-[1em]! *:h-auto! *:text-[currentColor]">{item.icon}</span>
      ) : null,
    [item],
  );

  if ('type' in item) {
    return <D.DropdownMenuSeparator />;
  }

  if ('to' in item) {
    return (
      <D.DropdownMenuItem asChild className="min-w-[140px] max-w-[220px]" disabled={item.disabled}>
        <Link
          to={item.to}
          target={item.target}
          className="font-medium! hover:no-underline!"
          onClick={(e) => {
            if (!item.disabled) {
              e.stopPropagation();
              item.onClick?.(e);
            }
          }}
        >
          {icon}
          <span className="flex flex-col">
            <span className="text-sm">{item.label}</span>
            {item.description && (
              <span className="opacity-[.6] mt-[1px] text-[10px] leading-[1.2]">
                {item.description}
              </span>
            )}
          </span>
        </Link>
      </D.DropdownMenuItem>
    );
  }

  return (
    <D.DropdownMenuItem
      disabled={item.disabled}
      className="min-w-[140px] max-w-[220px]"
      onClick={(e) => {
        if (!item.disabled) {
          e.stopPropagation();
          item.onClick?.(e);
        }
      }}
    >
      {icon}
      <span className="flex flex-col">
        <span>{item.label}</span>
        {item.description && (
          <span className="opacity-[.6] mt-[1px] text-[10px] leading-[1.2]">
            {item.description}
          </span>
        )}
      </span>
    </D.DropdownMenuItem>
  );
}
