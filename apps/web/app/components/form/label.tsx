import type { HTMLProps } from 'react';

import { cn } from '~/ui/lib/utils';

type Props = HTMLProps<HTMLLabelElement>;

export function Label({ className, ...props }: Props) {
  return (
    <label
      className={cn(
        'text-[8px] uppercase flex flex-row items-center gap-1.5 font-semibold opacity-[.4] px-[2px]',
        className,
      )}
      {...props}
    />
  );
}
