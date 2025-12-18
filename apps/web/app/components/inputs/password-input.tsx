import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';
import { useState } from 'react';

import type { ComponentProps } from 'react';

import { Tooltip } from '~/components/tooltip';
import { Input } from '~/ui/input';

type Props = Omit<ComponentProps<typeof Input>, 'type'> & {
  type?: ComponentProps<typeof Input>['type'];
};

export function PasswordInput(props: Props) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative w-full">
      <Input className="pr-8" type={showPassword ? 'text' : 'password'} {...props} />
      <Tooltip content={showPassword ? 'Hide password' : 'Show password'}>
        <button
          type="button"
          className="absolute flex right-2 p-1 top-1/2 -translate-y-1/2 text-[#333]/60 hover:text-[#333] focus:text-[#333] transition-all duration-120"
          onClick={() => setShowPassword((state) => !state)}
        >
          {showPassword ? (
            <EyeSlashIcon className="flex w-[14px] h-[14px]" />
          ) : (
            <EyeIcon className="flex w-[14px] h-[14px]" />
          )}
        </button>
      </Tooltip>
    </div>
  );
}
