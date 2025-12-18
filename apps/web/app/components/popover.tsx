import {
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
  type PropsWithChildren,
  type ReactNode,
} from 'react';

import * as P from '~/ui/popover';

type Props = Omit<ComponentProps<typeof P.PopoverContent>, 'content'> &
  PropsWithChildren<{
    content: ReactNode;
  }>;

export function Popover({ children, content, ...props }: Props) {
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
    <P.Popover>
      <P.PopoverTrigger asChild ref={triggerRef}>
        {children}
      </P.PopoverTrigger>
      <P.PopoverContent
        container={portalTarget}
        collisionBoundary={portalTarget}
        collisionPadding={4}
        {...props}
      >
        {content}
      </P.PopoverContent>
    </P.Popover>
  );
}
