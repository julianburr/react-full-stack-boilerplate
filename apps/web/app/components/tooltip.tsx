import { useLayoutEffect, useRef, useState } from 'react';

import type { ComponentProps, PropsWithChildren, ReactNode } from 'react';

import * as T from '~/ui/tooltip';

type Props = Omit<ComponentProps<typeof T.TooltipContent>, 'content'> &
  PropsWithChildren<{
    content: ReactNode;
  }>;

export function Tooltip({ children, content, ...props }: Props) {
  const triggerRef = useRef<any>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | undefined>(undefined);

  useLayoutEffect(() => {
    const portalTarget = triggerRef.current?.closest('[data-radix-portal]');
    setPortalTarget(portalTarget);
  }, []);

  if (!content) {
    return children;
  }

  return (
    <T.Tooltip>
      <T.TooltipTrigger ref={triggerRef} asChild>
        {children}
      </T.TooltipTrigger>
      <T.TooltipContent
        container={portalTarget}
        collisionBoundary={portalTarget}
        collisionPadding={4}
        {...props}
      >
        {content}
      </T.TooltipContent>
    </T.Tooltip>
  );
}
