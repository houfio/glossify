import type { ActionFunctionArgs, LoaderFunctionArgs} from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form, useSearchParams } from '@remix-run/react';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

import { prisma } from '../db.server';
import { createUserSession, getUserId } from '../session.server';
import { errorResponse } from '../utils/errorResponse.server';
import { validate } from '../utils/validate';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);

  if (userId) {
    return redirect('/');
  }

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await validate(request, {
    email: z.string().email(),
    password: z.string(),
    remember: z.string().optional(),
    redirect: z.string()
  });

  if (!data.success) {
    return data.response;
  }

  const user = await prisma.user.findUnique({
    where: { email: data.data.email }
  });

  if (!user || !await bcrypt.compare(data.data.password, user.password)) {
    return errorResponse('Invalid email or password');
  }

  return createUserSession(
    request,
    user.id,
    data.data.remember === 'on',
    data.data.redirect
  );
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  return (
    <Form method="post">
      <input name="email" type="email"/>
      <input name="password" type="password"/>
      <input name="remember" type="checkbox"/>
      <input name="redirect" type="hidden" value={redirectTo}/>
      <input type="submit"/>
    </Form>
  );
}
