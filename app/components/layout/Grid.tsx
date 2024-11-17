import { clsx } from 'clsx';
import type { PropsWithChildren } from 'react';
import { mapStyles } from '~/utils/styles.ts';
import styles from './Grid.module.scss';

type Props = {
  columns?: Record<string, number>;
  gaps?: Record<string, number>;
};

export function Grid({ columns = {}, gaps = {}, children }: PropsWithChildren<Props>) {
  return (
    <div
      className={clsx(
        styles.grid,
        mapStyles(styles, columns, 'columns-$key-$value'),
        mapStyles(styles, gaps, 'gaps-$key-$value')
      )}
    >
      {children}
    </div>
  );
}
