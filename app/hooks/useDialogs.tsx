import { type ReactNode, createContext, useState } from 'react';

// biome-ignore lint/suspicious/noExplicitAny: required for the type inference to work
type Modal = (...value: any[]) => ReactNode;

export const DialogContext = createContext<() => void>(() => {});

export function useDialogs<T extends Record<string, Modal>>(dialogs: T) {
  const [current, setCurrent] = useState<[keyof T, Parameters<T[keyof T]>]>();

  const open = <K extends keyof T>(dialog: K, ...values: Parameters<T[K]>) => setCurrent([dialog, values]);
  const close = () => setCurrent(undefined);
  const component = <DialogContext value={close}>{current && dialogs[current[0]]?.(...current[1])}</DialogContext>;

  return [open, close, component] as const;
}
