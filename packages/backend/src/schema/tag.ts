import { builder } from '../builder';
import { db } from '../db';

const Tag = builder.prismaObject('Tag', {
  authScopes: (tag, { userId }) => tag.userId === userId ? true : {
    admin: true
  },
  fields: (t) => ({
    id: t.exposeID('id'),
    tag: t.exposeString('tag'),
    color: t.expose('color', { type: 'Color' }),
    words: t.relation('words', {
      query: {
        orderBy: { left: 'asc' }
      }
    })
  })
});

builder.queryField('tag', (t) => t.prismaField({
  type: Tag,
  args: {
    id: t.arg.id({ required: true })
  },
  resolve: (query, _, { id }) => db.tag.findUniqueOrThrow({
    ...query,
    where: { id }
  })
}));

const CreateTagInput = builder.inputType('CreateTagInput', {
  fields: (t) => ({
    tag: t.string({ required: true }),
    color: t.field({ type: 'Color', required: true })
  })
});

builder.mutationField('createTag', (t) => t.prismaField({
  type: Tag,
  authScopes: {
    authenticated: true
  },
  args: {
    input: t.arg({ type: CreateTagInput, required: true })
  },
  resolve: (query, _, { input }, { userId }) => db.tag.create({
    ...query,
    data: {
      user: {
        connect: { id: userId }
      },
      tag: input.tag,
      color: input.color
    }
  })
}));
