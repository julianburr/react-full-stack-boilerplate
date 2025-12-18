import type { ComponentProps } from 'react';

import { cn } from '~/ui/lib/utils';

type Props = ComponentProps<'h1'> & {
  as?: React.ElementType;
  level: 1 | 2 | 3 | 4;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  variant?: 'light' | 'secondary' | 'default';
};

export function Heading({
  level,
  as: Component = `h${level}`,
  size = 'md',
  className,
  ...props
}: Props) {
  return (
    <Component
      data-size={size}
      className={cn(
        'text-lg font-bold data-[size=sm]:text-sm data-[size=md]:text-lg data-[size=lg]:text-xl data-[size=xl]:text-[24px] data-[size=xxl]:text-[32px] leading-[1.2]',
        className,
      )}
      {...props}
    />
  );
}
