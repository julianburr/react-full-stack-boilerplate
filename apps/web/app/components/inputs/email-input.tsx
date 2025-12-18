import type { ComponentProps } from 'react';

import { Input } from '~/ui/input';

type Props = Omit<ComponentProps<typeof Input>, 'type'> & {
  type?: ComponentProps<typeof Input>['type'];
};

export function EmailInput(props: Props) {
  return <Input type="email" {...props} />;
}
