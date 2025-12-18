import type { HTMLProps } from 'react';

import { cn } from '~/ui/lib/utils';

type Props = HTMLProps<HTMLHeadingElement>;

export function SectionHeading({ className, ...props }: Props) {
  return (
    <h2
      className={cn(
        'font-abc-extended text-xs font-bold text-[#fff]/48 uppercase tracking-[1.5px]',
        className,
      )}
      {...props}
    />
  );
}
