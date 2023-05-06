import type { User } from '@prisma/client';
import { createCookieSessionStorage, redirect } from '@vercel/remix';

import { prisma } from '~/db.server';

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production'
  }
});

function getSession(request: Request) {
  const cookie = request.headers.get('Cookie');

  return sessionStorage.getSession(cookie);
}

export async function getUserId(request: Request): Promise<User['id'] | undefined> {
  const session = await getSession(request);

  return session.get('userId');
}

export async function requireUserId(request: Request, redirectTo = new URL(request.url).pathname) {
  const userId = await getUserId(request);

  if (!userId) {
    const searchParams = new URLSearchParams([['redirect', redirectTo]]);

    throw redirect(`/login?${searchParams}`);
  }

  return userId;
}

export async function requireUser(request: Request, redirectTo?: string) {
  const userId = await requireUserId(request, redirectTo);
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw await logout(request);
  }

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
}

export async function createUserSession(request: Request, userId: string, remember: boolean, redirectTo: string) {
  const session = await getSession(request);

  session.set('userId', userId);

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session, {
        maxAge: remember ? 60 * 60 * 24 * 7 : undefined
      })
    }
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);

  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session)
    }
  });
}
