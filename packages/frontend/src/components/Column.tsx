import { ReactNode } from 'react';

import { cs } from '../utils/cs.ts';

import styles from './Column.module.scss';

type Props = {
  columns: Record<string, number>,
  children: ReactNode
};

export function Column({ columns, children }: Props) {
  const classes = Object.entries(columns).reduce((prev, [breakpoint, size]) => ({
    ...prev,
    [styles[`${breakpoint}-${size}`]]: true
  }), {});

  return (
    <div className={cs(styles.column, classes)}>
      {children}
    </div>
  );
}
