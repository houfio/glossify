import { builder } from '../builder';
import { db } from '../db';

enum WordType {
  NOUN = 'NOUN',
  VERB = 'VERB',
  ADVERB = 'ADVERB',
  ADJECTIVE = 'ADJECTIVE'
}

builder.enumType(WordType, {
  name: 'WordType'
});

const Word = builder.prismaObject('Word', {
  fields: (t) => ({
    id: t.exposeID('id'),
    type: t.field({
      type: WordType,
      resolve: (word) => word.type as WordType
    }),
    left: t.exposeString('left'),
    right: t.exposeString('right'),
    folder: t.relation('folder'),
    tags: t.relation('tags', {
      query: {
        orderBy: { tag: 'asc' }
      }
    })
  })
});

builder.queryField('word', (t) => t.prismaField({
  type: Word,
  args: {
    id: t.arg.id({ required: true })
  },
  resolve: (query, _, { id }) => db.word.findUniqueOrThrow({
    ...query,
    where: { id }
  })
}));

const CreateWordInput = builder.inputType('CreateWordInput', {
  fields: (t) => ({
    type: t.field({ type: WordType, required: true }),
    left: t.string({ required: true }),
    right: t.string({ required: true }),
    folderId: t.id({ required: true }),
    tagIds: t.idList({ required: true })
  })
});

builder.mutationField('createWord', (t) => t.prismaField({
  type: Word,
  authScopes: {
    authenticated: true
  },
  args: {
    input: t.arg({ type: CreateWordInput, required: true })
  },
  resolve: (query, _, { input }) => db.word.create({
    ...query,
    data: {
      folder: {
        connect: { id: input.folderId }
      },
      tags: {
        connect: input.tagIds.map((id) => ({ id }))
      },
      type: input.type,
      left: input.left,
      right: input.right
    }
  })
}));
