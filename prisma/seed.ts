import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../.prisma/client.ts';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const client = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error']
});

await client.language.createMany({
  data: [
    { name: 'Dutch', code: 'nl' },
    { name: 'French', code: 'fr' },
    { name: 'German', code: 'de' },
    { name: 'Italian', code: 'it' },
    { name: 'Portuguese', code: 'pt' },
    { name: 'Spanish', code: 'es' }
  ]
});

await client.$disconnect();
