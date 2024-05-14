import { unstable_defineAction } from '@remix-run/node';
import { Form } from '@remix-run/react';
import bcrypt from 'bcryptjs';

import { db } from '~/db.server';
import { login } from '~/session.server';

export const action = unstable_defineAction(async ({ request, response }) => {
  const data = await request.formData();
  const email = String(data.get('email'));
  const username = String(data.get('username'));
  const password = String(data.get('password'));

  const user = await db.user.create({
    data: {
      email,
      username,
      password: await bcrypt.hash(password, 10)
    }
  });

  throw await login(request, response, user.id);
});

export default function Register() {
  return (
    <div>
      Register
      <Form method="post">
        <input name="email"/>
        <input name="username"/>
        <input name="password"/>
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}
