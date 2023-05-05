import { DialoogProps } from 'dialoog';
import { HTMLProps } from 'react';

import styles from './Dialog.module.scss';

type Props = DialoogProps & HTMLProps<HTMLDivElement>;

export function Dialog({ open, close, remove, index, ...props }: Props) {
  return (
    <div
      className={styles.backdrop}
      style={{ animation: `${open ? styles.fadeIn : styles.fadeOut} .25s ease forwards` }}
      onClick={close}
    >
      <div
        className={styles.dialog}
        style={{ animation: `${open ? styles.slideIn : styles.slideOut} .25s ease forwards` }}
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={() => !open && remove()}
        {...props}
      />
    </div>
  );
}
