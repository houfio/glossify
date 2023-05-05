import { ReactNode } from 'react';

import { cs } from '../utils/cs.ts';

import styles from './Row.module.scss';

type Props = {
  spaces?: Record<string, number>,
  children: ReactNode
};

export function Row({ spaces = {}, children }: Props) {
  const classes = Object.entries(spaces).reduce((prev, [breakpoint, space]) => ({
    ...prev,
    [styles[`${breakpoint}-${space}`]]: true
  }), {});

  return (
    <div className={cs(styles.row, classes)}>
      {children}
    </div>
  );
}
