import { type ComponentProps } from 'react';

import { cn } from '~/ui/lib/utils';

type Props = Omit<ComponentProps<'span'>, 'color'> & {
  as?: React.ElementType;
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
  strength?: 'light' | 'default' | 'strong';
  weight?: 'normal' | 'bold';
};

export function Text({
  as: Component = 'span',
  size = 'md',
  className,
  strength,
  weight,
  ...props
}: Props) {
  return (
    <Component
      data-size={size}
      data-strength={strength}
      data-weight={weight}
      className={cn(
        'text-sm data-[size=xxs]:text-[8px] data-[size=xs]:text-[10px] data-[size=sm]:text-xs data-[size=lg]:text-base opacity-[.6] data-[strength=light]:opacity-[.40] data-[strength=strong]:opacity-[1] data-[weight=bold]:font-bold',
        className,
      )}
      {...props}
    />
  );
}

export function Bold(props: ComponentProps<typeof Text>) {
  return <Text className="font-semibold" {...props} />;
}

export const B = Bold;
