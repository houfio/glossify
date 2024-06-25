import type { PropsWithChildren } from 'react';
import { createContext, use } from 'react';

export function createProvidableHook<T, P>(fn: (props: P) => T, fallback: T) {
  const Context = createContext<T>(fallback);
  const hook = () => use(Context);

  hook.Provider = (props: PropsWithChildren<P>) => <Context value={fn(props)}>{props.children}</Context>;

  return hook;
}
