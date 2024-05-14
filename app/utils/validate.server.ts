import type { ZodRawShape } from 'zod';
import { z } from 'zod';

import { respond } from '~/utils/respond.server';

export async function validate<T extends ZodRawShape>(request: Request, shape: T) {
  const data = await request.clone().formData();
  const values = Object.fromEntries(data);
  const result = await z.object(shape).safeParseAsync(values);

  if (!result.success) {
    const issues = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message
    }));

    return respond(false, issues);
  }

  return respond(true, result.data);
}
