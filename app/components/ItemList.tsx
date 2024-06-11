import { clsx } from 'clsx';
import type { PropsWithChildren } from 'react';

import styles from './ItemList.module.scss';

import { withPalette } from '~/utils/withPalette';

type Props = {
  orientation: 'horizontal' | 'vertical',
  palette?: string,
  small?: boolean
};

export function ItemList({ orientation, palette = 'surface', small, children }: PropsWithChildren<Props>) {
  return (
    <div
      style={withPalette(palette)}
      className={clsx(
        styles.list,
        orientation === 'vertical' && styles.vertical,
        small && styles.small
      )}
    >
      {children}
    </div>
  );
}
