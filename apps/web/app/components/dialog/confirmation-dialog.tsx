import { Dialog } from './dialog';

import type { DialogPassThroughProps } from './dialog-stack-context';
import type { ComponentProps, ReactNode } from 'react';

import { Button } from '~/components/button';
import { P } from '~/components/text/paragraph';

type Props = DialogPassThroughProps &
  Omit<ComponentProps<typeof Dialog>, 'children'> & {
    content: ReactNode;
    confirmText?: string;
    onConfirm?: () => void | Promise<void>;
  };

export function ConfirmationDialog({
  content,
  onConfirm,
  confirmText = 'Confirm',
  ...props
}: Props) {
  const handleConfirm = async () => {
    await onConfirm?.();
    props.onClose?.();
  };

  return (
    <Dialog
      size="sm"
      actions={
        <Button variant="grey" onClick={handleConfirm}>
          {confirmText}
        </Button>
      }
      {...props}
    >
      {typeof content === 'string' ? <P>{content}</P> : content}
    </Dialog>
  );
}
