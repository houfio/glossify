import { unstable_defineAction } from '@remix-run/node';
import { Form, Link, useActionData } from '@remix-run/react';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

import { db } from '~/db.server';
import { login } from '~/session.server';
import { validate } from '~/utils/validate.server';

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

  return (
    <div>
      Register
      <Form method="post">
        <input name="email" type="email" required={true}/>
        <input name="username" required={true}/>
        <input name="password" type="password" required={true}/>
        <button type="submit">Register</button>
        <Link to="/login">Login</Link>
      </Form>
      <pre>
        {JSON.stringify(data, undefined, 2)}
      </pre>
    </div>
  );
}
