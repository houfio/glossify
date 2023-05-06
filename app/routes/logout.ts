import type { ActionFunction, LoaderFunction } from '@vercel/remix';
import { redirect } from '@vercel/remix';

import { logout } from '~/session.server';

export const action: ActionFunction = async ({ request }) => logout(request);

export const loader: LoaderFunction = async () => redirect('/');
