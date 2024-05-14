import { unstable_defineLoader } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

import { getUserId } from '~/session.server';

export const loader = unstable_defineLoader(async ({ request, response }) => {
  const userId = await getUserId(request);

  if (userId) {
    response.status = 302;
    response.headers.set('Location', '/');

    throw response;
  }

  return {};
});

export default function Auth() {
  return (
    <>
      auth
      <Outlet/>
    </>
  );
}
