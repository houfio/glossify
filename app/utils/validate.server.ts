import type { ZodType } from 'zod';

export async function validate<T extends ZodType>(data: FormData, shape: T) {
  const values = Object.fromEntries(data);

  return await shape.parseAsync(values);
}
