import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '~/prisma/client.ts';
import { remember } from '~/utils/remember.server.ts';

export const db = remember('prisma', () => {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

  return new PrismaClient({
    adapter,
    log: ['query', 'info', 'warn', 'error']
  });
});
