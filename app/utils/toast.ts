import { type ToastOptions, UNSTABLE_ToastQueue as ToastQueue } from 'react-aria-components';

export type ToastData = {
  message: string;
  palette: string;
};

export const toasts = new ToastQueue<ToastData>({
  maxVisibleToasts: 5
});

export function showToast(message: string, palette = 'surface', options?: ToastOptions) {
  toasts.add({ message, palette }, { timeout: 5_000, ...options });
}
