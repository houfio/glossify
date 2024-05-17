import { createCookieSessionStorage } from '@vercel/remix';

import { db } from '~/db.server';
import type { MessageType, ResponseStub } from '~/types';

type SessionData = {
  userId?: string,
  message?: string
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

export async function setMessage(request: Request, response: ResponseStub, message: string, type: MessageType = 'info') {
  const session = await getSession(request);

  session.flash('message', `${type};${message}`);

  response.headers.set('Set-Cookie', await storage.commitSession(session));
}

export async function getMessage(request: Request, response: ResponseStub) {
  const session = await getSession(request);
  const message = session.get('message');

  response.headers.set('Set-Cookie', await storage.commitSession(session));

  if (!message) {
    return;
  }

  const [type, msg] = message.split(';');

  return [type, msg] as [MessageType, string];
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
  session.flash('message', 'Successfully logged in');

  response.status = 302;
  response.headers.set('Location', '/');
  response.headers.set('Set-Cookie', await storage.commitSession(session));

  return response;
}

export async function logout(request: Request, response: ResponseStub) {
  const session = await getSession(request);

  session.unset('userId');
  session.flash('message', 'Successfully logged out');

  response.status = 302;
  response.headers.set('Location', '/login');
  response.headers.set('Set-Cookie', await storage.commitSession(session));

  return response;
}
