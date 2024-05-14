import { unstable_defineAction } from '@remix-run/node';
import { Form, Link, useActionData } from '@remix-run/react';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

import { db } from '~/db.server';
import { login } from '~/session.server';
import { respond } from '~/utils/respond.server';
import { validate } from '~/utils/validate.server';

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

  return (
    <div>
      Login
      <Form method="post">
        <input name="username" required={true}/>
        <input name="password" type="password" required={true}/>
        <button type="submit">Login</button>
        <Link to="/register">Register</Link>
      </Form>
      <pre>
        {JSON.stringify(data, undefined, 2)}
      </pre>
    </div>
  );
}
