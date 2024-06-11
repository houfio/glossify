import { faPenToSquare, faPlus, faTimes } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Word } from '@prisma/client';
import { useLoaderData, useSubmit } from '@remix-run/react';
import { unstable_defineLoader } from '@vercel/remix';
import { useState } from 'react';
import { z } from 'zod';

import { ItemList } from '~/components/ItemList';
import { Table } from '~/components/Table';
import { Button } from '~/components/forms/Button';
import { Container } from '~/components/layout/Container';
import { Header } from '~/components/layout/Header';
import { UpsertWordModal } from '~/components/modals/UpsertWordModal';
import { Tooltip } from '~/components/popovers/Tooltip';
import { db } from '~/db.server';
import { useConfirmation } from '~/hooks/useConfirmation';
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
  upsertWord: async (data, request, response) => {
    const userId = await requireUserId(request, response);
    const { id, word, definition } = await validate(data, z.object({
      id: z.string().optional(),
      word: z.string().min(1),
      definition: z.string().min(1)
    }));

    if (id) {
      const value = await db.word.update({
        where: { id, userId },
        data: {
          word,
          definition
        }
      });

      if (!value) {
        await setMessage(request, response, 'Unable to update word', 'error');

        return respond(false);
      }

      await setMessage(request, response, 'Successfully updated word', 'success');
    } else {
      await db.word.create({
        data: {
          userId,
          word,
          definition
        }
      });

      await setMessage(request, response, 'Successfully added word', 'success');
    }

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
  const submit = useSubmit();
  const user = useUser();
  const [open, setOpen] = useState<boolean | Omit<Word, 'userId'>>(false);
  const [prompt, component] = useConfirmation<string>('Are you sure you want to delete this word?', (id) => {
    const data = new FormData();

    data.set('intent', 'deleteWord');
    data.set('id', id);

    submit(data, {
      method: 'post'
    });
  });

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
              render: (value, row) => (
                <ItemList orientation="horizontal" palette="background" small={true}>
                  <button title="Edit" onClick={() => setOpen(row)}>
                    <FontAwesomeIcon icon={faPenToSquare}/>
                  </button>
                  <button title="Remove" onClick={() => prompt(value)}>
                    <FontAwesomeIcon icon={faTimes}/>
                  </button>
                </ItemList>
              )
            }
          }}
        />
      </Container>
      {open && (
        <UpsertWordModal
          word={typeof open === 'object' ? open : undefined}
          onClose={() => setOpen(false)}
        />
      )}
      {component}
    </>
  );
}
