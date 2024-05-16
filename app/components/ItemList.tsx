import { clsx } from 'clsx';
import type { PropsWithChildren } from 'react';

import styles from './ItemList.module.scss';

type Props = {
  direction: 'horizontal' | 'vertical'
};

export function ItemList({ direction, children }: PropsWithChildren<Props>) {
  return (
    <div className={clsx(styles.list, direction === 'vertical' && styles.vertical)}>
      {children}
    </div>
  );
}
