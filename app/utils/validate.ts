import { json } from '@vercel/remix';
import type { TypedResponse } from '@vercel/remix';
import type { objectOutputType, ZodError, ZodRawShape, ZodTypeAny } from 'zod';
import { z } from 'zod';

type ErrorResponse = TypedResponse<{ errors: { field: string, message: string }[] }>;
type ReturnType<T extends ZodRawShape> =
  { success: false, response: ErrorResponse } |
  { success: true, data: objectOutputType<T, ZodTypeAny> };

export async function validate<T extends ZodRawShape>(request: Request, shape: T): Promise<ReturnType<T>> {
  const data = await request.clone().formData();
  const values = Object.fromEntries(data);
  const result = await z.strictObject(shape).safeParseAsync(values);

  if (!result.success) {
    const errors = result.error as ZodError;
    const formatted = errors.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message
    }));

    return {
      success: false,
      response: json(
        { errors: formatted },
        400
      )
    };
  }

  return {
    success: true,
    data: result.data
  };
}
