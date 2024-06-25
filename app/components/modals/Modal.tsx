import { faXmark } from '@fortawesome/pro-regular-svg-icons';
import type { PropsWithChildren } from 'react';
import { use, useLayoutEffect, useRef } from 'react';

import styles from './Modal.module.scss';

import { Button } from '~/components/forms/Button';
import { ModalContext } from '~/hooks/useModals';

type Props = {
  title?: string,
  strict?: boolean,
  onClose?: (value?: string) => void
};

export function Modal({
  title,
  strict = Boolean(title),
  onClose = use(ModalContext),
  children
}: PropsWithChildren<Props>) {
  const ref = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    ref.current?.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      className={styles.modal}
      onClick={(e) => !strict && e.target instanceof HTMLDialogElement && onClose()}
      onCancel={(e) => strict && e.preventDefault()}
      onClose={(e) => onClose(e.currentTarget.returnValue || undefined)}
    >
      <div className={styles.box}>
        {title && (
          <div className={styles.title}>
            {title}
            <Button
              text="Close"
              icon={faXmark}
              palette="surface"
              small={true}
              onClick={() => onClose()}
            />
          </div>
        )}
        {children}
      </div>
    </dialog>
  );
}
