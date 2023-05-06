import type { LoaderFunction } from '@vercel/remix';
import { redirect } from '@vercel/remix';

export const loader: LoaderFunction = async () => redirect('/app/words');
