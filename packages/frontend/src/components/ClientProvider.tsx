import { authExchange } from '@urql/exchange-auth';
import { cacheExchange } from '@urql/exchange-graphcache';
import { createClient as createWSClient } from 'graphql-ws';
import { ReactNode, useMemo } from 'react';
import { Client, fetchExchange, Provider, subscriptionExchange } from 'urql';

import { useAuthentication } from '../states/authentication.ts';

type Props = {
  children: ReactNode
};

export function ClientProvider({ children }: Props) {
  const [{ token }, { removeToken }] = useAuthentication();
  const client = useMemo(() => {
    const wsClient = createWSClient({
      url: import.meta.env.VITE_WS_API_URL
    });

    return new Client({
      url: import.meta.env.VITE_API_URL,
      exchanges: [
        cacheExchange(),
        authExchange(async (utils) => ({
          addAuthToOperation: (operation) => !token ? operation : utils.appendHeaders(operation, {
            Authorization: `Bearer ${token}`
          }),
          didAuthError: (error) => error.graphQLErrors.some(e => e.extensions?.code === 'FORBIDDEN'),
          refreshAuth: removeToken
        })),
        fetchExchange,
        subscriptionExchange({
          forwardSubscription: (request) => ({
            subscribe: (sink) => ({
              unsubscribe: wsClient.subscribe({ ...request, query: request.query || '' }, sink)
            })
          })
        })
      ]
    });
  }, [token]);

  return (
    <Provider value={client}>
      {children}
    </Provider>
  );
}
