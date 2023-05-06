import { Link, useActionData, useSearchParams } from '@remix-run/react';
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@vercel/remix';
import { redirect } from '@vercel/remix';
import { hash } from 'bcryptjs';
import { z } from 'zod';

import { Auth } from '~/components/Auth';
import { Button } from '~/components/forms/Button';
import { Checkbox } from '~/components/forms/Checkbox';
import { Input } from '~/components/forms/Input';
import { prisma } from '~/db.server';
import { createUserSession, getUserId } from '~/session.server';
import { validate } from '~/utils/validate';

export const meta: V2_MetaFunction = () => [{ title: 'Register | Glossify' }];

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);

  if (userId) {
    return redirect('/');
  }

  return null;
};

export const action = async ({ request }: ActionArgs) => {
  const data = await validate(request, {
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
    remember: z.string().optional(),
    redirect: z.string()
  });

  if (!data.success) {
    return data.response;
  }

  const user = await prisma.user.create({
    data: {
      username: data.data.username,
      email: data.data.email,
      password: await hash(data.data.password, 10)
    }
  });

  return createUserSession(
    request,
    user.id,
    data.data.remember === 'on',
    data.data.redirect
  );
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  return (
    <Auth
      inputs={(
        <>
          <Input name="username" label="Username" errors={actionData?.errors}/>
          <Input name="email" label="Email" type="email" errors={actionData?.errors}/>
          <Input name="password" label="Password" type="password" errors={actionData?.errors}/>
          <input type="hidden" name="redirect" value={redirectTo}/>
        </>
      )}
      actions={(
        <>
          <Checkbox name="remember" label="Remember me"/>
          <Button text="Register" type="submit"/>
        </>
      )}
    >
      <span>
        Already have an account?{' '}
        <Link to={{ pathname: '/login', search: searchParams.toString() }}>
          Log in here
        </Link>
      </span>
    </Auth>
  );
}
