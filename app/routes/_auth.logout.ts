import { unstable_defineAction } from '@vercel/remix';

import { logout } from '~/session.server';

export const action = unstable_defineAction(async ({ request, response }) => {
  throw await logout(request, response);
});
