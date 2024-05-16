import { faXmark } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { PropsWithChildren } from 'react';
import { useLayoutEffect, useRef } from 'react';

import styles from './Modal.module.scss';

type Props = {
  title?: string,
  strict?: boolean,
  onClose: (value?: string) => void
};

export function Modal({ title, strict = Boolean(title), onClose, children }: PropsWithChildren<Props>) {
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
            <button title="Close" className={styles.close} onClick={() => onClose()}>
              <FontAwesomeIcon icon={faXmark}/>
            </button>
          </div>
        )}
        {children}
      </div>
    </dialog>
  );
}
