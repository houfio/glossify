export function remember<T>(key: string, value: () => T) {
  // biome-ignore lint/suspicious/noExplicitAny: type not relevant
  const g = globalThis as any;

  if (!g.__singletons?.[key]) {
    g.__singletons ??= {};
    g.__singletons[key] = value();
  }

  return g.__singletons[key] as T;
}
