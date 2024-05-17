import { atom } from 'nanostores';

import type { MessageType } from '~/types';

type Toast = {
  id: number,
  message: string,
  type: MessageType
};

export const $toasts = atom<Toast[]>([]);

export function openToast(message: string, type: MessageType = 'info') {
  const id = window.setTimeout(() => {
    closeToast(id);
  }, 5_000);

  $toasts.set([
    ...$toasts.get(),
    { id, message, type }
  ]);
}

export function closeToast(id: number) {
  clearTimeout(id);

  $toasts.set($toasts.get().filter((toast) => toast.id !== id));
}
