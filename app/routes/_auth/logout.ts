import { logout } from '~/utils/session.server.ts';
import type { Route } from './+types/logout.ts';

export const loader = async ({ context }: Route.LoaderArgs) => {
  throw await logout(context);
};
