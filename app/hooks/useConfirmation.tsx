import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';

import { ConfirmModal } from '~/components/modals/ConfirmModal';

const symbol = Symbol('open');

export function useConfirmation(message: string, onConfirm: () => void): [() => void, ReactNode];
export function useConfirmation<T>(
  message: string | ((value: T) => string),
  onConfirm: (value: T) => void
): [(value: T) => void, ReactNode];

export function useConfirmation<T>(message: string | ((value: T) => string), onConfirm: (value?: T) => void) {
  const [open, setOpen] = useState<T | symbol>();
  const prompt = useCallback((value?: T) => setOpen(value ?? symbol), []);

  const component = (
    <>
      {open !== undefined && (
        <ConfirmModal
          onClose={(confirmed) => {
            if (confirmed) {
              onConfirm(open === symbol ? undefined : (open as T));
            }

            setOpen(undefined);
          }}
        >
          {typeof message === 'function' ? message(open as T) : message}
        </ConfirmModal>
      )}
    </>
  );

  return [prompt, component as ReactNode];
}
