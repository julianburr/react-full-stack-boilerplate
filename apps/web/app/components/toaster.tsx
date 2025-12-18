import { WarningCircleIcon } from '@phosphor-icons/react';
import * as Sentry from '@sentry/react-router';
import { toast as hotToast, useToaster } from 'react-hot-toast';

export function Toaster() {
  const toaster = useToaster({ position: 'bottom-center' });
  return (
    <div className="absolute bottom-0 left-0 right-0 z-[100] flex flex-col gap-[2px] p-2 items-center justify-center pointer-events-none">
      {toaster.toasts.map((t) => {
        if (!t.message) {
          return null;
        }

        return (
          <div
            key={t.id}
            data-visible={t.visible}
            data-type={t.type}
            onMouseEnter={toaster.handlers.startPause}
            onMouseLeave={toaster.handlers.endPause}
            className="bg-[#393939] text-white [transition:opacity_200ms_ease-in-out,height_400ms_ease-in-out] opacity-0 transform data-[visible=true]:opacity-100 px-2.5 rounded-md text-xs data-[type=error]:bg-[#ea8686] h-0 data-[visible=true]:h-[28px] flex flow-row gap-1 items-center justify-center overflow-hidden max-w-[300px] pointer-events-auto shadow-[0px_0px_5.5px_-1px_#00000029,0px_6px_18px_-9px_#00000029]"
            {...t.ariaProps}
          >
            {t.type === 'error' && (
              <WarningCircleIcon className="flex flex-shrink-0 w-[14px] h-[14px]" />
            )}
            <span className="line-clamp-1">{t.message as string}</span>
          </div>
        );
      })}
    </div>
  );
}

function info(message: string) {
  return hotToast.success(message);
}

function error(error: Error | string, options: { originalError?: Error } = {}) {
  Sentry.captureException(error);
  console.error(options?.originalError || error);
  const e = error instanceof Error ? error : new Error(error);
  if (options.originalError) {
    e.cause = options.originalError;
  }
  return hotToast.error(e.message);
}

export const toast = { info, error };
