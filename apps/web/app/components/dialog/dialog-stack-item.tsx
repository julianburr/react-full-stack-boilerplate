import { useEffect, useRef, useState } from 'react';

import type { DialogStackContext } from './dialog-stack-context';
import type { ComponentProps } from 'react';

type Dialog = ComponentProps<typeof DialogStackContext>['value']['dialogs'][number];

export function DialogStackItem({ dialog, onClose }: { dialog: Dialog; onClose: () => void }) {
  // HACK: this allows us to easily animate the dialog and backdrop in and out
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const timer = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    clearTimeout(timer.current!);
    dialogRef.current?.showModal();
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      dialogRef.current?.close();
      onClose();
    }, 150);
  };

  return (
    <>
      <div
        data-visible={isVisible}
        className="absolute inset-0 z-[100] transition-all duration-120 ease-in-out bg-[#333]/0 data-[visible=true]:bg-[#333]/30"
      />
      <div
        data-visible={isVisible}
        className="absolute inset-0 z-[100] pointer-events-auto flex items-center justify-center p-4 sm:p-0 [&>dialog]:transition-all [&>dialog]:duration-120 [&>dialog]:ease-in-out [&>dialog]:opacity-0 [&>dialog]:scale-[.95] data-[visible=true]:[&>dialog]:opacity-100 data-[visible=true]:[&>dialog]:scale-[1]"
      >
        <dialog.Component {...dialog.props} onClose={handleClose} ref={dialogRef} />
      </div>
    </>
  );
}
