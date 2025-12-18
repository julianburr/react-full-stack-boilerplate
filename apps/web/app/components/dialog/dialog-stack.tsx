import { useContext } from 'react';

import { DialogStackContext } from './dialog-stack-context';
import { DialogStackItem } from './dialog-stack-item';

export function DialogStack() {
  const stack = useContext(DialogStackContext);
  return (
    <div
      data-dialog-stack
      data-dialog-count={stack.dialogs.length}
      data-active={!!stack.dialogs.length}
      className="absolute inset-0 z-[80] pointer-events-none"
    >
      {stack.dialogs.map((dialog) => (
        <DialogStackItem
          key={dialog.id}
          dialog={dialog}
          onClose={() => stack.removeDialog(dialog.id)}
        />
      ))}
    </div>
  );
}
