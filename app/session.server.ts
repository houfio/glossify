import { type Session, createCookieSessionStorage, redirect } from 'react-router';
import { db } from '~/db.server.ts';

type Data = {
  userId: string;
};

type FlashData = {
  message: string;
  palette: string;
};

const storage = createCookieSessionStorage<Data, FlashData>({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [String(process.env.SESSION_SECRET)],
    secure: true
  }
});

function getSession(request: Request) {
  const cookie = request.headers.get('Cookie');

  return storage.getSession(cookie);
}

export async function setMessage(session: Session, message: string, palette = 'surface') {
  session.flash('message', message);
  session.flash('palette', palette);

  return {
    'Set-Cookie': await storage.commitSession(session)
  };
}

export async function getMessage(request: Request) {
  const session = await getSession(request);
  const message = session.get('message');
  const palette = session.get('palette');

  if (!message || !palette) {
    return {};
  }

  return {
    message: [message, palette] as const,
    headers: {
      'Set-Cookie': await storage.commitSession(session)
    }
  };
}

export async function getUserId(request: Request) {
  const session = await getSession(request);

  return session.get('userId');
}

export async function requireUserId(request: Request) {
  const userId = await getUserId(request);

  if (!userId) {
    throw await logout(request);
  }

  return userId;
}

export async function requireUser(request: Request) {
  const userId = await requireUserId(request);
  const user = await db.user.findUnique({
    where: { id: userId },
    omit: { password: true }
  });

  if (!user) {
    throw await logout(request);
  }

  return user;
}

export async function login(request: Request, userId: string) {
  const session = await getSession(request);

  session.set('userId', userId);

  return redirect('/', {
    headers: await setMessage(session, 'Successfully logged in')
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);

  session.unset('userId');

  return redirect('/login', {
    headers: await setMessage(session, 'Successfully logged out')
  });
}
