import { faXmark } from '@fortawesome/pro-regular-svg-icons';
import { type PropsWithChildren, use, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '~/components/forms/Button';
import { DialogContext } from '~/hooks/useDialogs.tsx';
import styles from './Dialog.module.scss';

type Props = {
  title?: string;
};

export function Dialog({ title, children }: PropsWithChildren<Props>) {
  const ref = useRef<HTMLDialogElement>(null);
  const close = use(DialogContext);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  return createPortal(
    // biome-ignore lint/a11y/useKeyWithClickEvents: dialog has built-in key handling
    <dialog
      ref={ref}
      className={styles.dialog}
      onClick={(e) => !title && e.target instanceof HTMLDialogElement && close()}
      onClose={close}
    >
      <div className={styles.inner}>
        {title && (
          <div className={styles.header}>
            {title}
            <Button text="Close" icon={faXmark} small={true} palette="background" onClick={close} />
          </div>
        )}
        <div className={styles.content}>{children}</div>
      </div>
    </dialog>,
    document.body
  );
}
