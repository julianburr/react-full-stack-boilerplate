import { CheckIcon } from '@phosphor-icons/react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

import type * as React from 'react';

import { cn } from '~/ui/lib/utils';

type Props = React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  variant?: 'default' | 'purple';
};

function Checkbox({ className, variant, ...props }: Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        {
          'border-none bg-[#87179F]/10 data-[state=checked]:bg-[#87179F] data-[state=checked]:border-[#87179F]':
            variant === 'purple',
        },
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
