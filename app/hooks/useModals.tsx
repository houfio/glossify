import { type ReactNode, createContext, useState } from 'react';

// biome-ignore lint/suspicious/noExplicitAny: required for the type inference to work
type Modal = (value: any) => ReactNode;

export const ModalContext = createContext<() => void>(() => {});

export function useModals<T extends Record<string, Modal>>(modals: T) {
  const [current, setCurrent] = useState<[keyof T, Parameters<T[keyof T]>]>();

  const open = <K extends keyof T>(modal: K, ...value: Parameters<T[K]>) => setCurrent([modal, value[0]]);
  const close = () => setCurrent(undefined);
  const component = <ModalContext value={close}>{current && modals[current[0]](current[1])}</ModalContext>;

  return [open, close, component] as const;
}
