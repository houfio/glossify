import type { DependencyList } from 'react';
import { useCallback, useEffect } from 'react';

export function useTimeout(ms: number, fn: () => void, deps: DependencyList) {
  const callback = useCallback(fn, deps);

  useEffect(() => {
    const timeoutId = setTimeout(callback, ms);

    return () => clearTimeout(timeoutId);
  }, [ms, callback]);
}
