import { PrismaClient } from '@prisma/client';

import { remember } from '~/utils/remember.server.ts';

export const db = remember(
  'prisma',
  () =>
    new PrismaClient({
      log: ['query', 'info', 'warn', 'error']
    })
);
