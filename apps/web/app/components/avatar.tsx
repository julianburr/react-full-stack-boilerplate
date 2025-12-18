import { UserIcon } from '@phosphor-icons/react';
import { useState } from 'react';

type Props = {
  name?: string | null;
  avatarUrl?: string | null;
};

export function Avatar({ name, avatarUrl }: Props) {
  const [failed, setFailed] = useState(false);
  return (
    <span className="flex shrink-0 items-center justify-center h-8 w-8 rounded-full bg-[#39556c]/5 text-sm relative overflow-hidden">
      <span>{name ? name?.charAt(0) : <UserIcon />}</span>
      {avatarUrl && !failed && (
        <img
          src={avatarUrl}
          alt={name || '?'}
          className="w-full h-full object-cover absolute inset-0"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}
