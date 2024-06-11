import type { ReactNode } from 'react';
import { useState } from 'react';

export function useModals<T extends Record<string, unknown>>() {
  const [current, setCurrent] = useState<[keyof T, T[keyof T]]>();

  const open = <K extends keyof T>(modal: K, value: T[K]) => setCurrent([modal, value]);
  const close = () => setCurrent(undefined);
  const withModal = <K extends keyof T>(modal: K, render: (value: T[K]) => ReactNode) => {
    if (!current) {
      return;
    }

    const [m, v] = current;

    if (modal === m) {
      return render(v as T[K]);
    }
  };

  return [open, close, withModal] as const;
}
