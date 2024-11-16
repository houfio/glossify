import { useLayoutEffect, useRef } from 'react';
import { withPalette } from '~/utils/styles.ts';
import styles from './Toast.module.scss';

type Props = {
  message: string;
  palette: string;
  index: number;
};

export function Toast({ message, palette, index }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    ref.current?.showPopover();
  }, []);

  return (
    <div
      ref={ref}
      popover="manual"
      style={{
        bottom: `${index * 3 + 0.5}rem`,
        ...withPalette(palette)
      }}
      className={styles.toast}
    >
      {message}
    </div>
  );
}
