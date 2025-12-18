import { XIcon } from '@phosphor-icons/react';

import type { ReactNode } from 'react';

import { Button } from '~/components/button';
import { Text } from '~/components/text';

type Props = {
  ref?: React.RefObject<HTMLDialogElement>;
  title?: ReactNode;
  onClose?: () => void;
  children: ReactNode;
  actions?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  padded?: boolean;
};

export function Dialog({ ref, title, size, children, actions, onClose, padded = true }: Props) {
  return (
    <dialog
      ref={ref}
      data-dialog
      data-size={size}
      onClose={onClose}
      className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 right-auto bottom-auto flex self-center flex-col w-[calc(100vw-2rem)] max-w-[400px] data-[size=sm]:max-w-[300px] data-[size=lg]:max-w-[500px] data-[size=xl]:max-w-[840px] bg-[#fff] text-[#333] rounded-md border-none"
      data-radix-portal
    >
      <div className="sticky top-0 z-10 flex flex-row items-center gap-2 p-2 bg-[#fff] border-b-[1px] border-b-solid border-b-[#333]/5">
        <Text
          strength="light"
          className="flex flex-1 px-2 text-[10px] uppercase font-semibold font-sans"
        >
          {title}
        </Text>
        <div className="flex flex-row gap-1">
          <Button variant="ghost" icon={<XIcon />} onClick={onClose} />
        </div>
      </div>

      <div className="relative flex flex-col w-full h-fit max-h-[min(calc(100vh-6rem),500px)] overflow-auto">
        <div data-padded={padded} className="flex flex-col flex-1 data-[padded=true]:p-4">
          {children}
        </div>

        {actions && (
          <div className="sticky bottom-0 z-10 w-full bg-[#fff] flex flex-row items-center justify-end gap-1 p-3 border-t-[1px] border-t-solid border-t-[#333]/5">
            {actions}
          </div>
        )}
      </div>
    </dialog>
  );
}
