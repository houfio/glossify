import { DialoogProps, useDialoog } from 'dialoog';

import { useTimeout } from '../../hooks/useTimeout.ts';

import styles from './Notification.module.scss';

type Props = DialoogProps & {
  text: string
};

export function Notification({ text, index, open, close, remove }: Props) {
  const [{ dialogs }] = useDialoog();

  useTimeout(5000, close, []);

  const total = dialogs.filter((dialog) => dialog.stack === 'notifications').length - 1;

  return (
    <button
      className={styles.notification}
      style={{
        bottom: `${(total - index) * 4 + 1}rem`,
        animation: `${open ? styles.slideIn : styles.slideOut} .25s ease forwards`
      }}
      onClick={close}
      onAnimationEnd={() => !open && remove()}
    >
      {text}
    </button>
  );
}
