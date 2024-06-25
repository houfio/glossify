import { faFloppyDisk } from '@fortawesome/pro-regular-svg-icons';
import { Theme } from '@prisma/client';
import { useActionData } from '@remix-run/react';
import { z } from 'zod';

import { Button } from '~/components/forms/Button';
import { Form } from '~/components/forms/Form';
import { Input } from '~/components/forms/Input';
import { Select } from '~/components/forms/Select';
import { db } from '~/db.server';
import { useUser } from '~/hooks/useUser';
import { requireUserId, setMessage } from '~/session.server';
import { createActions } from '~/utils/createActions.server';
import { respond } from '~/utils/respond.server';
import { validate } from '~/utils/validate.server';

export const action = createActions({
  updateProfile: async (data, request, response) => {
    const { username, theme } = await validate(
      data,
      z.object({
        username: z.string().trim().min(3),
        theme: z.nativeEnum(Theme)
      })
    );

    const userId = await requireUserId(request, response);

    await db.user.update({
      where: { id: userId },
      data: {
        username,
        theme
      }
    });

    await setMessage(request, response, 'Successfully updated profile', 'success');

    return respond(true);
  }
});

export default function Profile() {
  const data = useActionData<typeof action>();
  const { username, theme } = useUser();

  return (
    <>
      <Form method="post" issues={data?.issues}>
        <Input label="Username" name="username" defaultValue={username} />
        <Select
          label="Theme"
          options={[
            {
              value: 'AUTOMATIC',
              label: 'Automatic'
            },
            {
              value: 'LIGHT',
              label: 'Light'
            },
            {
              value: 'DARK',
              label: 'Dark'
            }
          ]}
          name="theme"
          defaultValue={theme}
        />
        <Button text="Save" icon={faFloppyDisk} type="submit" name="intent" value="updateProfile" />
      </Form>
    </>
  );
}
