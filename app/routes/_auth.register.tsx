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
import { validate } from '~/utils/validate.server';

export const meta: MetaFunction = () => [
  { title: 'Glossify / Register' }
];

export const action = unstable_defineAction(async ({ request, response }) => {
  const data = await validate(request, {
    email: z.string().email(),
    username: z.string().min(3),
    password: z.string().min(3)
  });

  if (!data.success) {
    return data;
  }

  const user = await db.user.create({
    data: {
      email: data.data.email,
      username: data.data.username,
      password: await bcrypt.hash(data.data.password, 10)
    }
  });

  throw await login(request, response, user.id);
});

export default function Register() {
  const data = useActionData<typeof action>();

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  return (
    <>
      <Form method="post">
        <Input label="Email" name="email" type="email" required={true}/>
        <Input label="Username" name="username" required={true}/>
        <Input label="Password" name="password" type="password" required={true}/>
        <Button text="Register" icon={faArrowRightToBracket} type="submit"/>
      </Form>
      <Link to="/login">Login</Link>
    </>
  );
}
