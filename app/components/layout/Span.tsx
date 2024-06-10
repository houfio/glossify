import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import type { PropsWithChildren } from 'react';

import styles from './Span.module.scss';

import { mapStyles } from '~/utils/mapStyles';

type Props = {
  span?: Record<string, number>,
  asChild?: boolean
};

export function Span({ span = {}, asChild, children }: PropsWithChildren<Props>) {
  const Component = asChild ? Slot : 'div';

  return (
    <Component className={clsx(mapStyles(styles, span, 'spans-$key-$value'))}>
      {children}
    </Component>
  );
}
