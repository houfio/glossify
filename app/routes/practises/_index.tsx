import { NavLink } from 'react-router';
import { db } from '~/db.server.ts';
import { getUser } from '~/middleware/user.ts';
import type { Route } from './+types/_index.ts';

export const loader = async ({ context }: Route.LoaderArgs) => {
  const user = getUser(context);
  const practises = await db.practise.findMany({
    where: {
      userId: user.id,
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
          {practise.name} ({practise.language.name})<NavLink to={practise.id}>Continue</NavLink>
        </div>
      ))}
    </div>
  );
}
