import type { HTMLProps } from 'react';

import styles from './Row.module.css';

type Props = {
  gap?: number
};

export function Row({ gap, ...props }: Props & HTMLProps<HTMLDivElement>) {
  return (
    <div
      style={{ gap: gap && `${gap}rem` }}
      className={styles.row}
      {...props}
    />
  );
}
