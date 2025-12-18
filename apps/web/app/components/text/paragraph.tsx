import { Text } from './core';

import type { ComponentProps } from 'react';

type Props = ComponentProps<typeof Text>;

export function Paragraph(props: Props) {
  return <Text as="p" {...props} />;
}

export const P = Paragraph;
