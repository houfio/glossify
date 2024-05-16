import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';

import styles from './ItemList.module.scss';

type Props = ComponentPropsWithoutRef<'div'> & {
  direction: 'horizontal' | 'vertical'
};

export function ItemList({ direction, className, ...props }: Props) {
  return (
    <div className={clsx(styles.list, direction === 'vertical' && styles.vertical, className)} {...props}/>
  );
}
