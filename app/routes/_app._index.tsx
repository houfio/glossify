import { faArrowRightFromBracket } from '@fortawesome/pro-regular-svg-icons';
import { unstable_defineLoader } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';

import { Button } from '~/components/Button';
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
        <Button type="submit" icon={faArrowRightFromBracket}>Logout</Button>
      </Form>
    </>
  );
}
