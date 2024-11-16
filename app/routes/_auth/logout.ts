import { logout } from '~/session.server.ts';
import type { Route } from './+types/logout.ts';

export const loader = async ({ request }: Route.LoaderArgs) => {
  throw await logout(request);
};
