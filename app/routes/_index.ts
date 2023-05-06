import type { LoaderFunction } from '@vercel/remix';
import { redirect } from '@vercel/remix';

import { requireUserId } from '~/session.server';

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);

  return redirect('/app/words');
};
