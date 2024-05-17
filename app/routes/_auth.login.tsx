import { faArrowRightToBracket } from '@fortawesome/pro-regular-svg-icons';
import { Link, useActionData } from '@remix-run/react';
import type { MetaFunction } from '@vercel/remix';
import { unstable_defineAction } from '@vercel/remix';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

import { Button } from '~/components/forms/Button';
import { Form } from '~/components/forms/Form';
import { Input } from '~/components/forms/Input';
import { db } from '~/db.server';
import { login, setMessage } from '~/session.server';
import { respond } from '~/utils/respond.server';
import { validate } from '~/utils/validate.server';

export const meta: MetaFunction = () => [
  { title: 'Glossify / Login' }
];

export const action = unstable_defineAction(async ({ request, response }) => {
  const data = await validate(request, response, {
    username: z.string().min(3),
    password: z.string().min(3)
  });

  if (!data.success) {
    return data;
  }

  const user = await db.user.findUnique({
    where: { username: data.data.username }
  });

  if (user && await bcrypt.compare(data.data.password, user.password)) {
    throw await login(request, response, user.id);
  }

  await setMessage(request, response, 'Invalid credentials', 'error');

  return respond(false);
});

export default function Login() {
  const data = useActionData<typeof action>();

  return (
    <>
      <Form method="post" issues={data?.issues}>
        <Input label="Username" name="username" required={true}/>
        <Input label="Password" name="password" type="password" required={true}/>
        <Button text="Log in" icon={faArrowRightToBracket} type="submit"/>
      </Form>
      <Link to="/register">Register</Link>
    </>
  );
}
