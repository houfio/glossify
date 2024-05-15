import { faArrowRightToBracket } from '@fortawesome/pro-regular-svg-icons';
import { type MetaFunction, unstable_defineAction } from '@remix-run/node';
import { Form, Link, useActionData } from '@remix-run/react';
import bcrypt from 'bcryptjs';
import { useEffect } from 'react';
import { z } from 'zod';

import { Button } from '~/components/Button';
import { Input } from '~/components/Input';
import { db } from '~/db.server';
import { login } from '~/session.server';
import { respond } from '~/utils/respond.server';
import { validate } from '~/utils/validate.server';

export const meta: MetaFunction = () => [
  { title: 'Glossify / Login' }
];

export const action = unstable_defineAction(async ({ request, response }) => {
  const data = await validate(request, {
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

  return respond(false, ['Invalid credentials']);
});

export default function Login() {
  const data = useActionData<typeof action>();

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  return (
    <>
      <Form method="post">
        <Input label="Username" name="username" required={true}/>
        <Input label="Password" name="password" type="password" required={true}/>
        <Button text="Login" icon={faArrowRightToBracket} type="submit"/>
      </Form>
      <Link to="/register">Register</Link>
    </>
  );
}
