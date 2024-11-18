import { db } from '~/db.server.ts';

export async function findWordsForPractise(count: number, languageId: string, tagIds: string[]) {
  return db.word.findMany({
    where: {
      languageId,
      AND: tagIds.map((id) => ({
        tags: {
          some: { id }
        }
      }))
    },
    take: count
  });
}
