import { Prisma } from '@prisma/client';

import { errorResponse } from '~/utils/errorResponse.server';

export function prismaResponse(e: unknown) {
  if (!(e instanceof Prisma.PrismaClientKnownRequestError)) {
    const message = typeof e === 'string' ? e : e instanceof Error ? e.message : 'Something went wrong';

    return errorResponse(message);
  }

  const target = e.meta?.target;
  const field = Array.isArray(target) ? target[target.length - 1] : undefined;

  return errorResponse([field, 'Already in use']);
}
