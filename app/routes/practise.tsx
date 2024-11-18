import type { Route } from './+types/practise.ts';
import { requireUserId } from '~/session.server.ts';
import { db } from '~/db.server.ts';
import { redirect } from 'react-router';

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const userId = await requireUserId(request);
  const practise = await db.practise.findUnique({
    where: {
      id: params.id,
      userId
    }
  });

  if (!practise) {
    throw redirect('/practises');
  }

  return {
    practise
  };
};

export default function Component({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <pre>{JSON.stringify(loaderData, null, 2)}</pre>
    </div>
  );
}
