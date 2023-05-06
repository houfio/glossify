export function cs(...classes: (string | Record<string, boolean | undefined> | undefined)[]) {
  return classes.flatMap((cls) => {
    if (typeof cls === 'string') {
      return cls;
    } else if (!cls) {
      return undefined;
    }

    const keys = Object.keys(cls);

    return keys.filter((key) => cls[key]);
  }).filter(Boolean).join(' ');
}
