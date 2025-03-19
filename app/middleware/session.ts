import {
  type Session,
  createCookieSessionStorage,
  type unstable_MiddlewareFunction,
  type unstable_RouterContextProvider,
  unstable_createContext
} from 'react-router';

type Data = {
  userId: string;
};

type FlashData = {
  message: string;
  palette: string;
};

const sessionStorage = createCookieSessionStorage<Data, FlashData>({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [String(process.env.SESSION_SECRET)],
    secure: true
  }
});

const sessionContext = unstable_createContext<Session<Data, FlashData>>();

export const sessionMiddleware: unstable_MiddlewareFunction<Response> = async ({ request, context }, next) => {
  const session = await sessionStorage.getSession(request.headers.get('Cookie'));

  context.set(sessionContext, session);

  const response = await next();

  response.headers.append('Set-Cookie', await sessionStorage.commitSession(session));

  return response;
};

export function getSession(context: unstable_RouterContextProvider) {
  return context.get(sessionContext);
}
