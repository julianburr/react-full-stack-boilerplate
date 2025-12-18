import { useLayoutEffect, useRef, useState, type ChangeEvent } from 'react';

import * as S from '~/ui/select';

type SelectItemValue =
  | {
      label: string;
      value: string;
    }
  | {
      type: 'label';
      label: string;
    };

type Props = {
  value?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  items?: SelectItemValue[];
};

export function SelectInput({ placeholder, items, onChange, ...props }: Props) {
  const triggerRef = useRef<any>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | undefined>(undefined);

  useLayoutEffect(() => {
    const portalTarget = triggerRef.current?.closest('[data-radix-portal]');
    setPortalTarget(portalTarget);
  }, []);

  return (
    <S.Select onValueChange={(value) => onChange?.({ target: { value } } as any)} {...props}>
      <S.SelectTrigger ref={triggerRef} className="w-full">
        <S.SelectValue placeholder={placeholder || 'Select an item...'} />
      </S.SelectTrigger>
      <S.SelectContent
        container={portalTarget}
        collisionBoundary={portalTarget}
        collisionPadding={4}
      >
        <S.SelectGroup>
          {items?.map((item) => {
            if ('type' in item) {
              return <S.SelectLabel key={item.label}>{item.label}</S.SelectLabel>;
            }
            return (
              <S.SelectItem key={item.value} value={item.value}>
                {item.label}
              </S.SelectItem>
            );
          })}
        </S.SelectGroup>
      </S.SelectContent>
    </S.Select>
  );
}
