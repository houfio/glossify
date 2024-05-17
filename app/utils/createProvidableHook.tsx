import type { PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';

export function createProvidableHook<T, P>(fn: (props: P) => T, fallback?: T) {
  const context = createContext<T>(fallback as T);
  const useHook = () => {
    const value = useContext(context);

    if (value === undefined) {
      throw new Error('Context not defined');
    }

    return value;
  };

  useHook.Provider = (props: PropsWithChildren<P>) => (
    <context.Provider value={fn(props)}>
      {props.children}
    </context.Provider>
  );

  return useHook;
}
