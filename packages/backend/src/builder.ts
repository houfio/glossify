import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects';
import ValidationPlugin from '@pothos/plugin-validation';

import { db } from './db';

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Scalars: {
    ID: {
      Input: string;
      Output: number | string;
    };
    Color: {
      Input: string;
      Output: string;
    }
  };
  Context: {
    userId?: string;
  };
  AuthScopes: {
    authenticated: boolean;
    admin: boolean;
  };
}>({
  plugins: [
    ScopeAuthPlugin,
    PrismaPlugin,
    ValidationPlugin,
    SimpleObjectsPlugin
  ],
  authScopes: (context) => ({
    authenticated: Boolean(context.userId),
    admin: false
  }),
  scopeAuthOptions: {
    authorizeOnSubscribe: true
  },
  prisma: {
    client: db
  }
});

builder.queryType();
builder.mutationType();

builder.scalarType('Color', {
  serialize: (n) => n,
  parseValue: (n) => {
    if (typeof n === 'string' && /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(n)) {
      return n;
    }

    throw new Error('Value must be a hex color');
  },
})
