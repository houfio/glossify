import { db } from '~/db.server.ts';
import { requireUserId } from '~/session.server.ts';
import type { Route } from './+types/practises.ts';
import { NavLink } from 'react-router';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const userId = await requireUserId(request);
  const practises = await db.practise.findMany({
    where: {
      userId,
      NOT: {
        words: {
          every: {
            results: { some: { correct: true } }
          }
        }
      }
    },
    include: {
      language: true
    }
  });

  return {
    practises
  };
};

export default function Component({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      {loaderData.practises.map((practise) => (
        <div key={practise.id}>
          {practise.name} ({practise.language.name})
          <NavLink to={practise.id}>
            Continue
          </NavLink>
        </div>
      ))}
    </div>
  );
}
