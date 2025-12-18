import type { ComponentProps } from 'react';
import type { Input } from '~/ui/input';

import { InputOTP, InputOTPGroup, InputOTPSlot } from '~/ui/input-otp';

type Props = Omit<ComponentProps<typeof Input>, 'render' | 'children'> & {
  length?: number;
};

export function OtpInput({ length = 6, value, ...props }: Props) {
  return (
    <InputOTP
      {...props}
      value={`${value}`}
      onChange={(value) => props.onChange?.({ target: { value: `${value}` } } as any)}
      maxLength={length}
    >
      <InputOTPGroup>
        {Array.from({ length }).map((_, index) => (
          <InputOTPSlot className="text-lg w-11 h-11" key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
