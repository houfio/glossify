import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';

import styles from './ItemList.module.scss';

type Props = ComponentPropsWithoutRef<'div'> & {
  orientation: 'horizontal' | 'vertical'
};

export function ItemList({ orientation, className, ...props }: Props) {
  return (
    <div className={clsx(styles.list, orientation === 'vertical' && styles.vertical, className)} {...props}/>
  );
}
