import { PrismaClient } from '@prisma/client/index.js';

import { remember } from '~/utils/remember.server.ts';

export const db = remember(
  'prisma',
  () =>
    new PrismaClient({
      log: ['query', 'info', 'warn', 'error']
    })
);
