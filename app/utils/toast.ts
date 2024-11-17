import { type ToastOptions, ToastQueue } from '@react-stately/toast';

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
