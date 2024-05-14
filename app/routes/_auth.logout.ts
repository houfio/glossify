import { unstable_defineAction } from '@remix-run/node';

import { logout } from '~/session.server';

export const action = unstable_defineAction(async ({ request, response }) => {
  throw await logout(request, response);
});
