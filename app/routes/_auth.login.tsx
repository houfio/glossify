import { unstable_defineAction } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import bcrypt from 'bcryptjs';

import { db } from '~/db.server';
import { login } from '~/session.server';

export const action = unstable_defineAction(async ({ request, response }) => {
  const data = await request.formData();
  const username = String(data.get('username'));
  const password = String(data.get('password'));

  const user = await db.user.findUnique({
    where: { username }
  });

  if (user && await bcrypt.compare(password, user.password)) {
    throw await login(request, response, user.id);
  }

  return { ok: false };
});

export default function Login() {
  const data = useActionData<typeof action>();

  return (
    <div>
      Login
      <Form method="post">
        <input name="username"/>
        <input name="password"/>
        <button type="submit">Submit</button>
      </Form>
      <pre>
        {JSON.stringify(data, undefined, 2)}
      </pre>
    </div>
  );
}
