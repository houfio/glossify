import { useCallback, useState } from 'react';

import { ConfirmModal } from '~/components/modals/ConfirmModal';

export function useConfirmation<T = boolean>(message: string, onConfirm: (value: T extends boolean ? undefined : T) => void) {
  const [open, setOpen] = useState<T | boolean>(false);
  const prompt = useCallback((value?: T) => setOpen(value ?? true), []);

  const component = (
    <>
      {open !== false && (
        <ConfirmModal
          onClose={(confirmed) => {
            if (confirmed) {
              onConfirm(open === true ? undefined : open as any);
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
