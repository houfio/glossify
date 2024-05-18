import { Theme } from '@prisma/client';
import { useActionData } from '@remix-run/react';
import { z } from 'zod';

import { Button } from '~/components/forms/Button';
import { Form } from '~/components/forms/Form';
import { Input } from '~/components/forms/Input';
import { db } from '~/db.server';
import { useUser } from '~/hooks/useUser';
import { requireUserId, setMessage } from '~/session.server';
import { createActions } from '~/utils/createActions.server';
import { defineResponse } from '~/utils/defineResponse.server';
import { validate } from '~/utils/validate.server';

export const action = createActions({
  updateUsername: async (data, request, response) => {
    const { username } = await validate(data, {
      username: z.string().min(3)
    });

    const userId = await requireUserId(request, response);

    await db.user.update({
      where: { id: userId },
      data: { username }
    });

    await setMessage(request, response, 'Successfully updated username', 'success');

    return defineResponse(true);
  },
  updateProfile: async (data, request, response) => {
    const { theme } = await validate(data, {
      theme: z.nativeEnum(Theme)
    });

    const userId = await requireUserId(request, response);

    await db.user.update({
      where: { id: userId },
      data: { theme }
    });

    await setMessage(request, response, 'Successfully updated profile', 'success');

    return defineResponse(true);
  }
});

export default function Profile() {
  const data = useActionData<typeof action>();
  const { username, theme } = useUser();

  return (
    <>
      <Form method="post" issues={data?.action === 'updateUsername' ? data.issues : []}>
        <Input label="Username" name="username" defaultValue={username}/>
        <Button text="Save" type="submit" name="intent" value="updateUsername"/>
      </Form>
      <Form method="post" issues={data?.action === 'updateProfile' ? data.issues : []}>
        <Input label="Theme" name="theme" defaultValue={theme}/>
        <Button text="Save" type="submit" name="intent" value="updateProfile"/>
      </Form>
    </>
  );
}
