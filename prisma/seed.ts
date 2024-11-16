import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();

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
