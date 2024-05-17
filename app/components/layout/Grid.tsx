import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import type { PropsWithChildren } from 'react';

import styles from './Grid.module.scss';

import { mapStyles } from '~/utils/mapStyles';

type Props = {
  columns?: Record<string, number>,
  gaps?: Record<string, number>,
  asChild?: boolean
};

export function Grid({ columns = {}, gaps = {}, asChild, children }: PropsWithChildren<Props>) {
  const Component = asChild ? Slot : 'div';

  return (
    <Component
      className={clsx(
        styles.grid,
        mapStyles(styles, columns, 'columns-$key-$value'),
        mapStyles(styles, gaps, 'gaps-$key-$value')
      )}
    >
      {children}
    </Component>
  );
}
