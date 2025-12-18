import { Spinner } from '~/components/spinner';

type Props = {
  message?: string;
};

export function LoadingState({ message = 'Loading...' }: Props) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Spinner size={24} className="w-4 h-4 animate-loader-rotate opacity-[.3]" />
      <p className="opacity-[.4] text-xs p-4 pt-3 text-center text-balance">{message}</p>
    </div>
  );
}
