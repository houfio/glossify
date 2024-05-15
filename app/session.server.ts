import { createCookieSessionStorage } from '@vercel/remix';

import { db } from '~/db.server';
import type { ResponseStub } from '~/types';

type SessionData = {
  userId?: string
};

const storage = createCookieSessionStorage<SessionData>({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET ?? ''],
    secure: process.env.NODE_ENV === 'production'
  }
});

function getSession(request: Request) {
  const cookie = request.headers.get('Cookie');

  return storage.getSession(cookie);
}

export async function getUserId(request: Request) {
  const session = await getSession(request);

  return session.get('userId');
}

export async function requireUserId(request: Request, response: ResponseStub) {
  const userId = await getUserId(request);

  if (!userId) {
    throw await logout(request, response);
  }

  return userId;
}

export async function requireUser(request: Request, response: ResponseStub) {
  const userId = await requireUserId(request, response);
  const user = await db.user.findUnique({
    where: { id: userId },
    omit: { password: true }
  });

  if (!user) {
    throw await logout(request, response);
  }

  return user;
}

export async function login(request: Request, response: ResponseStub, userId: string) {
  const session = await getSession(request);

  session.set('userId', userId);

  response.status = 302;
  response.headers.set('Location', '/');
  response.headers.set('Set-Cookie', await storage.commitSession(session));

  return response;
}

export async function logout(request: Request, response: ResponseStub) {
  const session = await getSession(request);

  response.status = 302;
  response.headers.set('Location', '/login');
  response.headers.set('Set-Cookie', await storage.destroySession(session));

  return response;
}
