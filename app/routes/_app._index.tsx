import { unstable_defineLoader } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';

import { requireUser } from '~/session.server';

export const loader = unstable_defineLoader(async ({ request, response }) => {
  const user = await requireUser(request, response);

  return { user };
});

export default function Index() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <>
      <pre>
        {JSON.stringify(user, undefined, 2)}
      </pre>
      <Form method="post" action="/logout">
        <button type="submit">Logout</button>
      </Form>
    </>
  );
}
