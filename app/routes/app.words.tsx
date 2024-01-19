import type { LoaderFunctionArgs} from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { requireUser } from '../session.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request);

  return json({
    username: user.username
  });
};

export default function Words() {
  const { username } = useLoaderData<typeof loader>();

  return (
    <div>
      Hello, {username}!
    </div>
  );
}
