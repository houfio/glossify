import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import { builder } from '../builder';
import { secret } from '../constants';
import { db } from '../db';

const User = builder.prismaObject('User', {
  authScopes: (user, { userId }) => user.id === userId ? true : {
    admin: true,
    $granted: 'readUser'
  },
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    username: t.exposeString('username'),
    folders: t.relation('folders', {
      query: {
        where: { parent: null },
        orderBy: { name: 'asc' }
      }
    }),
    tags: t.relation('tags', {
      query: {
        orderBy: { tag: 'asc' }
      }
    })
  })
});

builder.queryField('user', (t) => t.prismaField({
  type: User,
  args: {
    id: t.arg.id({ required: true })
  },
  resolve: (query, _, { id }) => db.user.findUniqueOrThrow({
    ...query,
    where: { id }
  })
}));

builder.queryField('me', (t) => t.prismaField({
  type: User,
  authScopes: {
    authenticated: true
  },
  resolve: (query, _, __, { userId }) => db.user.findUniqueOrThrow({
    ...query,
    where: { id: userId }
  })
}));

const RegisterInput = builder.inputType('RegisterInput', {
  fields: (t) => ({
    email: t.string({ required: true, validate: { email: true } }),
    password: t.string({ required: true }),
    username: t.string({ required: true })
  })
});

builder.mutationField('register', (t) => t.prismaField({
  type: User,
  nullable: true,
  args: {
    input: t.arg({ type: RegisterInput, required: true })
  },
  grantScopes: ['readUser'],
  resolve: async (query, _, { input }) => db.user.create({
    ...query,
    data: {
      email: input.email,
      password: await hash(input.password, 10),
      username: input.username
    }
  })
}));

const LoginInput = builder.inputType('LoginInput', {
  fields: (t) => ({
    email: t.string({ required: true, validate: { email: true } }),
    password: t.string({ required: true })
  })
});

const LoginData = builder.simpleObject('LoginData', {
  fields: (t) => ({
    token: t.string(),
    user: t.field({ type: User })
  })
});

builder.mutationField('login', (t) => t.field({
  type: LoginData,
  args: {
    input: t.arg({ type: LoginInput, required: true })
  },
  grantScopes: ['readUser'],
  resolve: async (query, { input }) => {
    const user = await db.user.findUniqueOrThrow({
      where: { email: input.email }
    });

    if (!await compare(input.password, user.password)) {
      throw new Error();
    }

    return {
      token: sign(user.id, secret),
      user
    };
  }
}));
