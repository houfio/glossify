import { faXmark } from '@fortawesome/pro-regular-svg-icons';
import type { PropsWithChildren, ReactNode } from 'react';
import {
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay
} from 'react-aria-components';
import { Button } from '~/components/forms/Button';
import styles from './Dialog.module.scss';

type Props = {
  title: string;
  dialog: ReactNode | ((close: () => void) => ReactNode);
};

export function Dialog({ title, dialog, children }: PropsWithChildren<Props>) {
  return (
    <AriaDialogTrigger>
      {children}
      <AriaModalOverlay className={styles.overlay}>
        <AriaModal className={styles.modal}>
          <AriaDialog className={styles.dialog}>
            {({ close }) => (
              <>
                <div className={styles.header}>
                  {title}
                  <Button
                    text="Close"
                    icon={faXmark}
                    showText={false}
                    variant="flat"
                    size="small"
                    palette="background"
                    onPress={close}
                  />
                </div>
                <div className={styles.content}>{typeof dialog === 'function' ? dialog(close) : dialog}</div>
              </>
            )}
          </AriaDialog>
        </AriaModal>
      </AriaModalOverlay>
    </AriaDialogTrigger>
  );
}
