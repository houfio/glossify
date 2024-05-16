import { useRouteLoaderData } from '@remix-run/react';

import type { loader } from '~/routes/_app/route';

export function useUser() {
  const { user } = useRouteLoaderData<typeof loader>('routes/_app');

  return user;
}
