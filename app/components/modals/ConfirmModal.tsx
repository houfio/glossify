import type { PropsWithChildren } from 'react';

import styles from './ConfirmModal.module.scss';

import { ItemList } from '~/components/ItemList';
import { Modal } from '~/components/modals/Modal';

type Props = {
  onClose: (confirmed: boolean) => void
};

export function ConfirmModal({ onClose, children }: PropsWithChildren<Props>) {
  return (
    <Modal
      title="Confirm"
      strict={false}
      onClose={(value) => onClose(value === 'confirm')}
    >
      <form method="dialog" className={styles.form}>
        <div>
          {children}
        </div>
        <ItemList orientation="horizontal" className={styles.items}>
          <button type="submit" autofocus="true">
            No
          </button>
          <button type="submit" value="confirm">
            Yes
          </button>
        </ItemList>
      </form>
    </Modal>
  );
}
