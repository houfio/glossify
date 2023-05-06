import type { objectOutputType, ZodError, ZodRawShape, ZodTypeAny } from 'zod';
import { z } from 'zod';

import { errors } from '~/utils/errors.server';

type Validate<T extends ZodRawShape> =
  { success: false, response: ReturnType<typeof errors> } |
  { success: true, data: objectOutputType<T, ZodTypeAny> };

export async function validate<T extends ZodRawShape>(request: Request, shape: T): Promise<Validate<T>> {
  const data = await request.clone().formData();
  const values = Object.fromEntries(data);
  const result = await z.strictObject(shape).safeParseAsync(values);

  if (!result.success) {
    const e = result.error as ZodError;
    const issues = e.issues.map((issue) => ([
      issue.path.join('.'),
      issue.message
    ] as const));

    return {
      success: false,
      response: errors(...issues)
    };
  }

  return {
    success: true,
    data: result.data
  };
}
