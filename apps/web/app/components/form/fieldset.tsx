import type { HTMLProps } from 'react';

import { cn } from '~/ui/lib/utils';

type Props = HTMLProps<HTMLFieldSetElement> & {
  title?: string;
};

export function Fieldset({ children, title, className, ...props }: Props) {
  return (
    <fieldset
      className={cn('flex flex-col gap-3 text-left w-full items-start', className)}
      {...props}
    >
      {title && <legend className="text-sm font-medium">{title}</legend>}
      {children}
    </fieldset>
  );
}
