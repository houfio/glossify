import { faXmark } from '@fortawesome/pro-regular-svg-icons';
import { useStore } from '@nanostores/react';
import type { PropsWithChildren } from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import styles from './Modal.module.scss';

import { Button } from '~/components/forms/Button';
import { $openModal } from '~/stores/modals';

type Props = {
  title?: string,
  strict?: boolean,
  onClose: (value?: string) => void
};

export function Modal({ title, strict = Boolean(title), onClose, children }: PropsWithChildren<Props>) {
  const ref = useRef<HTMLDialogElement>(null);
  const [id] = useState(() => crypto.randomUUID());
  const openModal = useStore($openModal);

  useLayoutEffect(() => {
    ref.current?.showModal();
    $openModal.set(id);

    return () => {
      if ($openModal.get() === id) {
        $openModal.set('');
      }
    };
  }, [id]);

  useEffect(() => {
    if (openModal && openModal !== id) {
      onClose();
    }
  }, [openModal, onClose]);

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
