import { useLayoutEffect, useRef } from 'react';

import styles from './Toast.module.scss';

type Props = {
  message: string,
  index: number
};

export function Toast({ message, index }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    ref.current?.showPopover();
  }, []);

  return (
    <div
      ref={ref}
      popover="manual"
      style={{ bottom: `${index * 3 + .5}rem` }}
      className={styles.toast}
    >
      {message}
    </div>
  );
}
