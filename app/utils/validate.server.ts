import type { ZodRawShape } from 'zod';
import { z } from 'zod';

export async function validate<T extends ZodRawShape>(data: FormData, shape: T) {
  const values = Object.fromEntries(data);

  return await z.object(shape).parseAsync(values);
}
