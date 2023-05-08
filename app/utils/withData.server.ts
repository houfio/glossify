import type { objectOutputType, ZodRawShape, ZodTypeAny } from 'zod';

import { prismaResponse } from '~/utils/prismaResponse.server';
import { successResponse } from '~/utils/successResponse.server';
import { validate } from '~/utils/validate';

export function withData<T extends ZodRawShape, V>(request: Request, shape: T, handle: (data: objectOutputType<T, ZodTypeAny>) => Promise<V>) {
  return async () => {
    const data = await validate(request, shape);

    if (!data.success) {
      return data.response;
    }

    try {
      const result = await handle(data.data);

      return successResponse(result);
    } catch (e) {
      return prismaResponse(e);
    }
  };
}
