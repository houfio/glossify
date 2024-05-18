import { useActionData } from '@remix-run/react';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

import { Button } from '~/components/forms/Button';
import { Form } from '~/components/forms/Form';
import { Input } from '~/components/forms/Input';
import { db } from '~/db.server';
import { requireUserId, setMessage } from '~/session.server';
import { createActions } from '~/utils/createActions.server';
import { defineResponse } from '~/utils/defineResponse.server';
import { validate } from '~/utils/validate.server';

export const action = createActions({
  updatePassword: async (data, request, response) => {
    const userId = await requireUserId(request, response);
    const { password } = await db.user.findUniqueOrThrow({
      where: { id: userId },
      select: { password: true }
    });

    const { newPassword } = await validate(data, z.object({
      currentPassword: z.string().min(3),
      newPassword: z.string().min(3),
      confirmPassword: z.string().min(3)
    }).refine((obj) => bcrypt.compare(obj.currentPassword, password), {
      message: 'Current password not correct',
      path: ['currentPassword']
    }).refine((obj) => obj.newPassword === obj.confirmPassword, {
      message: 'Passwords don\'t match',
      path: ['confirmPassword']
    }));

    await db.user.update({
      where: { id: userId },
      data: {
        password: await bcrypt.hash(newPassword, 10)
      }
    });

    await setMessage(request, response, 'Successfully updated password', 'success');

    return defineResponse(true);
  }
});

export default function Profile() {
  const data = useActionData<typeof action>();

  return (
    <>
      <Form method="post" issues={data?.issues}>
        <Input label="Current password" name="currentPassword" type="password" required={true}/>
        <Input label="New password" name="newPassword" type="password" required={true}/>
        <Input label="Confirm password" name="confirmPassword" type="password" required={true}/>
        <Button text="Save" type="submit" name="intent" value="updatePassword"/>
      </Form>
    </>
  );
}
