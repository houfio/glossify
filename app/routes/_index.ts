import type { LoaderArgs } from '@vercel/remix';
import { redirect } from '@vercel/remix';

import { requireUserId } from '~/session.server';

export const loader = async ({ request }: LoaderArgs) => {
  await requireUserId(request);

  return redirect('/app/words');
};
