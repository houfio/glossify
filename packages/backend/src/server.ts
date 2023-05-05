import { createServer } from 'node:http';

import { createYoga } from 'graphql-yoga';
import { verify } from 'jsonwebtoken';

import { secret } from './constants';
import { schema } from './schema';

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/',
  context: async ({ request }) => {
    const token = request.headers.get('Authorization') || '';

    if (!token) {
      return;
    }

    return {
      userId: verify(token.substring(7), secret) as string
    };
  }
});

export const server = createServer(yoga);
