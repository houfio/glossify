import { useCallback, useState } from 'react';

import { ConfirmModal } from '~/components/modals/ConfirmModal';

export function useConfirmation(message: string, onConfirm: () => void) {
  const [open, setOpen] = useState(false);
  const prompt = useCallback(() => setOpen(true), []);

  const component = (
    <>
      {open && (
        <ConfirmModal
          onClose={(confirmed) => {
            if (confirmed) {
              onConfirm();
            }

            setOpen(false);
          }}
        >
          {message}
        </ConfirmModal>
      )}
    </>
  );

  return [prompt, component] as const;
}
