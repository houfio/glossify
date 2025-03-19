import { logout } from '~/utils/session.server.ts';
import type { Route } from './+types/logout.ts';

export async function loader({ context }: Route.LoaderArgs) {
  throw await logout(context);
}
