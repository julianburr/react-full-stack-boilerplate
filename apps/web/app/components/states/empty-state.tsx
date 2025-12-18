import { cn } from '~/ui/lib/utils';

export function EmptyState({ message, className }: { message: string; className?: string }) {
  return (
    <div
      className={cn(
        'w-full p-6 flex flex-col gap-1 items-center justify-center text-center bg-[#333]/5 rounded-md',
        className,
      )}
    >
      <p className="opacity-[.4] text-sm text-balance">{message}</p>
    </div>
  );
}
