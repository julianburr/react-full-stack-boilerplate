import { useCallback, useContext, useMemo } from 'react';

import { DialogStackContext } from './dialog-stack-context';

import type { DialogPassThroughProps } from './dialog-stack-context';
import type { ComponentPropsWithoutRef, ElementType } from 'react';

let uid = 0;

export function useDialog<T extends ElementType>(Component: T) {
  const stack = useContext(DialogStackContext);

  const open = useCallback(
    (props?: Omit<ComponentPropsWithoutRef<T>, keyof DialogPassThroughProps>) => {
      return stack.addDialog({
        id: `${++uid}`,
        Component,
        props: props || {},
      });
    },
    [Component, stack],
  );

  return useMemo(() => ({ open }), [open]);
}
