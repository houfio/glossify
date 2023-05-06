import { redirect } from '@vercel/remix';

export const loader = async () => redirect('/app/words');
