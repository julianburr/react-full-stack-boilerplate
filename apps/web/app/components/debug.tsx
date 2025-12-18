import type { HTMLProps } from 'react';

import { cn } from '~/ui/lib/utils';

type Props = Omit<HTMLProps<HTMLPreElement>, 'data' | 'children'> & {
  data?: any;
};

export function Debug({ data, className, ...props }: Props) {
  return (
    <pre className={cn('font-mono text-xs', className)} {...props}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
