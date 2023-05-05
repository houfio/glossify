import { builder } from '../builder';
import { db } from '../db';

const Folder = builder.prismaObject('Folder', {
  authScopes: (folder, { userId }) => folder.userId === userId ? true : {
    admin: true
  },
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    leftFlag: t.exposeString('leftFlag'),
    rightFlag: t.exposeString('rightFlag'),
    words: t.relation('words', {
      query: {
        orderBy: { left: 'asc' }
      }
    }),
    parent: t.relation('parent', { nullable: true }),
    children: t.relation('children', {
      query: {
        orderBy: { name: 'asc' }
      }
    }),
    user: t.relation('user')
  })
});

builder.queryField('folder', (t) => t.prismaField({
  type: Folder,
  args: {
    id: t.arg.id({ required: true })
  },
  resolve: (query, _, { id }) => db.folder.findUniqueOrThrow({
    ...query,
    where: { id }
  })
}));

const CreateFolderInput = builder.inputType('CreateFolderInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    leftFlag: t.string({ required: true }),
    rightFlag: t.string({ required: true }),
    parentId: t.id()
  })
});

builder.mutationField('createFolder', (t) => t.prismaField({
  type: Folder,
  authScopes: {
    authenticated: true
  },
  args: {
    input: t.arg({ type: CreateFolderInput, required: true })
  },
  resolve: (query, _, { input }, { userId }) => db.folder.create({
    ...query,
    data: {
      user: {
        connect: { id: userId }
      },
      ...input.parentId && {
        parent: {
          connect: { id: input.parentId }
        }
      },
      name: input.name,
      leftFlag: input.leftFlag,
      rightFlag: input.rightFlag
    }
  })
}));
