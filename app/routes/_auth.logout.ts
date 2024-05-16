import { unstable_defineLoader } from '@vercel/remix';

import { logout } from '~/session.server';

export const loader = unstable_defineLoader(async ({ request, response }) => {
  throw await logout(request, response);
});
