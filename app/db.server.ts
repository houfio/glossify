import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

declare global {
  var __db__: ReturnType<typeof getClient>;
}

let prisma = global.__db__;

if (process.env.NODE_ENV === 'production') {
  prisma = getClient();
} else if (!global.__db__) {
  prisma = global.__db__ = getClient();
}

function getClient() {
  return new PrismaClient()
    .$extends(withAccelerate());
}

export { prisma };
