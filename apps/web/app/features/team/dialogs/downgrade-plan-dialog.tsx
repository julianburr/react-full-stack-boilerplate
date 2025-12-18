import { useCallback } from 'react';

import type { DialogPassThroughProps } from '~/components/dialog/dialog-stack-context';

import { Button } from '~/components/button';
import { Dialog } from '~/components/dialog';
import { P } from '~/components/text';
import { toast } from '~/components/toaster';
import { api } from '~/utils/api';
import { useAuth } from '~/utils/auth';

export function DowngradePlanDialog(props: DialogPassThroughProps) {
  const auth = useAuth();

  const handleSubmit = useCallback(async () => {
    try {
      await api('/team/billing/downgrade', { method: 'POST' });
      await auth.refresh();
      await props.onClose?.();
      toast.info('Plan downgraded successfully');
    } catch (e: any) {
      toast.error(e);
    }
  }, []);

  return (
    <Dialog
      {...props}
      title="Downgrade plan"
      actions={
        <Button variant="primary" onClick={handleSubmit}>
          Downgrade
        </Button>
      }
    >
      <P>
        Are you sure you want to downgrade your plan? You will loose access to all premium features
        at the end of the current billingperiod.
      </P>
    </Dialog>
  );
}
