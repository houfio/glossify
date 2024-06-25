export function remember<T>(key: string, value: T) {
  // biome-ignore lint/suspicious/noExplicitAny: type not relevant
  const g = global as any;

  g.__singletons ??= {};
  g.__singletons[key] ??= value;

  return g.__singletons[key] as T;
}
