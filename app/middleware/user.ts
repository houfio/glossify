import {
  type unstable_MiddlewareFunction,
  type unstable_RouterContextProvider,
  unstable_createContext
} from 'react-router';
import { db } from '~/db.server.ts';
import { getSession } from '~/middleware/session.ts';
import type { User } from '~/prisma/client.ts';
import { logout } from '~/utils/session.server.ts';

const userContext = unstable_createContext<Omit<User, 'password'>>();

export const userMiddleware: unstable_MiddlewareFunction<Response> = async ({ context }, next) => {
  const session = getSession(context);
  const userId = session.get('userId');

  if (!userId) {
    throw await logout(context);
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    omit: { password: true }
  });

  if (!user) {
    throw await logout(context);
  }

  context.set(userContext, user);

  return next();
};

export function getUser(context: unstable_RouterContextProvider) {
  return context.get(userContext);
}
