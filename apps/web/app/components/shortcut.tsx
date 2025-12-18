import type { ComponentProps } from 'react';

import { cn } from '~/ui/lib/utils';

type Props = ComponentProps<'span'>;

export function Shortcut({ className, ...props }: Props) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn('text-muted-foreground ml-auto text-xs tracking-widest', className)}
      {...props}
    />
  );
}
