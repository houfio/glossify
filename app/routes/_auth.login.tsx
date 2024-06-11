import { faArrowRightToBracket } from '@fortawesome/pro-regular-svg-icons';
import { Link, useActionData } from '@remix-run/react';
import type { MetaFunction } from '@vercel/remix';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

import { Button } from '~/components/forms/Button';
import { Form } from '~/components/forms/Form';
import { Input } from '~/components/forms/Input';
import { db } from '~/db.server';
import { login, setMessage } from '~/session.server';
import { createActions } from '~/utils/createActions.server';
import { respond } from '~/utils/respond.server';
import { validate } from '~/utils/validate.server';

export const meta: MetaFunction = () => [
  { title: 'Glossify / Login' }
];

export const action = createActions({
  login: async (data, request, response) => {
    const { username, password } = await validate(data, z.object({
      username: z.string().trim().min(3),
      password: z.string().min(3)
    }));

    const user = await db.user.findUnique({
      where: { username },
      select: { id: true, password: true }
    });

    if (user && await bcrypt.compare(password, user.password)) {
      throw await login(request, response, user.id);
    }

    await setMessage(request, response, 'Invalid credentials', 'error');

    return respond(false);
  }
});

export default function Login() {
  const data = useActionData<typeof action>();

  return (
    <>
      <Form method="post" issues={data?.issues}>
        <Input label="Username" name="username" required={true}/>
        <Input label="Password" name="password" type="password" required={true}/>
        <Button text="Log in" icon={faArrowRightToBracket} type="submit" name="intent" value="login"/>
      </Form>
      <Link to="/register">Register</Link>
    </>
  );
}
