import { atom } from 'nanostores';

type Toast = {
  id: number;
  message: string;
  palette: string;
};

export const $toasts = atom<Toast[]>([]);

export function openToast(message: string, palette = 'accent') {
  const id = window.setTimeout(() => {
    closeToast(id);
  }, 5_000);

  $toasts.set([...$toasts.get(), { id, message, palette }]);
}

export function closeToast(id: number) {
  clearTimeout(id);

  $toasts.set($toasts.get().filter((toast) => toast.id !== id));
}
