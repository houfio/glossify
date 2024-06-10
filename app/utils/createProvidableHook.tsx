import type { PropsWithChildren } from 'react';
import { createContext, use } from 'react';

export function createProvidableHook<T, P>(fn: (props: P) => T, fallback?: T) {
  const Context = createContext<T>(fallback!);
  const hook = () => {
    const value = use(Context);

    if (value === undefined) {
      throw new Error('Context not defined');
    }

    return value;
  };

  hook.Provider = (props: PropsWithChildren<P>) => (
    <Context value={fn(props)}>
      {props.children}
    </Context>
  );

  return hook;
}
