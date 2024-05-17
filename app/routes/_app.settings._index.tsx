import { useActionData } from '@remix-run/react';
import { unstable_defineAction } from '@vercel/remix';
import { z } from 'zod';

import { Button } from '~/components/forms/Button';
import { Form } from '~/components/forms/Form';
import { Input } from '~/components/forms/Input';
import { db } from '~/db.server';
import { useUser } from '~/hooks/useUser';
import { requireUserId, setMessage } from '~/session.server';
import { respond } from '~/utils/respond.server';
import { validate } from '~/utils/validate.server';

export const action = unstable_defineAction(async ({ request, response }) => {
  const data = await validate(request, {
    username: z.string().min(3)
  });

  if (!data.success) {
    return data;
  }

  const userId = await requireUserId(request, response);

  await db.user.update({
    where: { id: userId },
    data: {
      username: data.data.username
    }
  });

  await setMessage(request, response, 'Successfully updated profile');

  return respond(true);
});

export default function Profile() {
  const data = useActionData<typeof action>();
  const { username } = useUser();

  return (
    <span>
      <Form method="post" issues={data?.issues}>
        <Input label="Username" name="username" defaultValue={username}/>
        <Button text="Save" type="submit"/>
      </Form>
    </span>
  );
}
