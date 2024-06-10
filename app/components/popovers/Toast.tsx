import { clsx } from 'clsx';
import { useLayoutEffect, useRef } from 'react';

import styles from './Toast.module.scss';

import type { MessageType } from '~/types';
import { withPalette } from '~/utils/withPalette';

type Props = {
  message: string,
  type: MessageType,
  index: number
};

const palette: Record<MessageType, string> = {
  info: 'surface-variant',
  success: 'accent',
  error: 'error'
};

export function Toast({ message, type, index }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    ref.current?.showPopover();
  }, []);

  return (
    <div
      ref={ref}
      popover="manual"
      style={{
        bottom: `${index * 3 + .5}rem`,
        ...withPalette(palette[type])
      }}
      className={clsx(styles.toast, styles[type])}
    >
      {message}
    </div>
  );
}
