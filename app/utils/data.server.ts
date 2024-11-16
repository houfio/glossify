export function parseFormData(data: FormData) {
  const result: Record<string, string | string[]> = {};

  for (let [key, value] of data.entries()) {
    if (typeof value === 'object') {
      continue;
    }

    if (key.endsWith('[]')) {
      key = key.slice(0, -2);

      result[key] ??= [];
      (result[key] as string[]).push(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}
