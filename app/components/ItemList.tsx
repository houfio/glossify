import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';

import styles from './ItemList.module.scss';

import { withPalette } from '~/utils/withPalette';

type Props = ComponentPropsWithoutRef<'div'> & {
  orientation: 'horizontal' | 'vertical',
  palette?: string
};

export function ItemList({ orientation, palette = 'surface', style, className, ...props }: Props) {
  return (
    <div
      style={withPalette(palette, style)}
      className={clsx(styles.list, orientation === 'vertical' && styles.vertical, className)}
      {...props}
    />
  );
}
