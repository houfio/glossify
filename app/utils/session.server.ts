import { redirect, type unstable_RouterContextProvider } from 'react-router';
import { getSession } from '~/middleware/session.ts';

export function setMessage(context: unstable_RouterContextProvider, message: string, palette = 'surface') {
  const session = getSession(context);

  session.flash('message', message);
  session.flash('palette', palette);
}

export async function login(context: unstable_RouterContextProvider, userId: string) {
  const session = getSession(context);

  session.set('userId', userId);
  setMessage(context, 'Successfully logged in');

  return redirect('/');
}

export async function logout(context: unstable_RouterContextProvider) {
  const session = getSession(context);

  session.unset('userId');
  setMessage(context, 'Successfully logged out');

  return redirect('/login');
}
