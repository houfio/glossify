import { faPlus, faTimes } from '@fortawesome/pro-regular-svg-icons';
import { Form, useLoaderData } from '@remix-run/react';
import { unstable_defineLoader } from '@vercel/remix';
import { useState } from 'react';
import { z } from 'zod';

import { Table } from '~/components/Table';
import { Button } from '~/components/forms/Button';
import { Container } from '~/components/layout/Container';
import { Header } from '~/components/layout/Header';
import { AddWordModal } from '~/components/modals/AddWordModal';
import { Tooltip } from '~/components/popovers/Tooltip';
import { db } from '~/db.server';
import { useUser } from '~/hooks/useUser';
import { requireUserId, setMessage } from '~/session.server';
import { createActions } from '~/utils/createActions.server';
import { respond } from '~/utils/respond.server';
import { validate } from '~/utils/validate.server';

export const loader = unstable_defineLoader(async ({ request, response }) => {
  const userId = await requireUserId(request, response);
  const words = await db.word.findMany({
    where: { userId },
    omit: { userId: true },
    orderBy: { word: 'asc' }
  });

  return { words };
});

export const action = createActions({
  createWord: async (data, request, response) => {
    const userId = await requireUserId(request, response);
    const { word, definition } = await validate(data, z.object({
      word: z.string(),
      definition: z.string()
    }));

    await db.word.create({
      data: {
        userId,
        word,
        definition
      }
    });

    await setMessage(request, response, 'Successfully added word', 'success');

    return respond(true);
  },
  deleteWord: async (data, request, response) => {
    const userId = await requireUserId(request, response);
    const { id } = await validate(data, z.object({
      id: z.string()
    }));

    const word = await db.word.delete({
      where: { id, userId }
    });

    if (!word) {
      await setMessage(request, response, 'Unable to remove word', 'error');

      return respond(false);
    }

    await setMessage(request, response, 'Successfully removed word', 'success');

    return respond(true);
  }
});

export default function Index() {
  const { words } = useLoaderData<typeof loader>();
  const user = useUser();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Header text="Words">
        <Button text="Add" icon={faPlus} onClick={() => setOpen(true)}/>
      </Header>
      <Container>
        <Tooltip content="This is your ID">
          {user.id}
        </Tooltip>
        <Table
          data={words}
          rowKey="id"
          columns={{
            word: {
              title: 'Word',
              render: (value) => value
            },
            definition: {
              title: 'Definition',
              render: (value) => value
            },
            id: {
              title: '',
              render: (value) => (
                <Form method="post">
                  <input name="id" value={value} type="hidden"/>
                  <Button
                    text="Remove"
                    icon={faTimes}
                    palette="background"
                    small={true}
                    type="submit"
                    name="intent"
                    value="deleteWord"
                  />
                </Form>
              )
            }
          }}
        />
      </Container>
      {open && (
        <AddWordModal onClose={() => setOpen(false)}/>
      )}
    </>
  );
}
