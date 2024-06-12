import { faFolder, faInputText } from '@fortawesome/pro-regular-svg-icons';
import type { List, Word } from '@prisma/client';
import { useActionData, useLoaderData, useSubmit } from '@remix-run/react';
import { unstable_defineLoader } from '@vercel/remix';
import { useEffect } from 'react';
import { z } from 'zod';

import { Button } from '~/components/forms/Button';
import { Container } from '~/components/layout/Container';
import { Header } from '~/components/layout/Header';
import { UpsertListModal } from '~/components/modals/UpsertListModal';
import { UpsertWordModal } from '~/components/modals/UpsertWordModal';
import { db } from '~/db.server';
import { useConfirmation } from '~/hooks/useConfirmation';
import { useModals } from '~/hooks/useModals';
import { Lists } from '~/routes/_app._index/Lists';
import { Words } from '~/routes/_app._index/Words';
import { requireUserId, setMessage } from '~/session.server';
import { createActions } from '~/utils/createActions.server';
import { respond } from '~/utils/respond.server';
import { validate } from '~/utils/validate.server';

export const loader = unstable_defineLoader(async ({ request, response }) => {
  const userId = await requireUserId(request, response);
  const { words, lists } = await db.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      words: {
        orderBy: { word: 'asc' }
      },
      lists: {
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: {
              words: true
            }
          }
        }
      }
    }
  });

  return { words, lists };
});

export const action = createActions({
  upsertWord: async (data, request, response) => {
    const userId = await requireUserId(request, response);
    const { id, word, definition, listId } = await validate(data, z.object({
      id: z.string().optional(),
      word: z.string().trim().min(1),
      definition: z.string().trim().min(1),
      listId: z.string()
    }));

    if (id) {
      const value = await db.word.update({
        where: { id, userId },
        data: {
          word,
          definition,
          list: listId ? {
            connect: { id: listId }
          } : {
            disconnect: true
          }
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
          definition,
          listId: listId || undefined
        }
      });

      await setMessage(request, response, 'Successfully added word', 'success');
    }

    return respond(true);
  },
  upsertList: async (data, request, response) => {
    const userId = await requireUserId(request, response);
    const { id, name } = await validate(data, z.object({
      id: z.string().optional(),
      name: z.string().trim().min(1)
    }));

    if (id) {
      const value = await db.list.update({
        where: { id, userId },
        data: { name }
      });

      if (!value) {
        await setMessage(request, response, 'Unable to update list', 'error');

        return respond(false);
      }

      await setMessage(request, response, 'Successfully updated list', 'success');
    } else {
      await db.list.create({
        data: {
          userId,
          name
        }
      });

      await setMessage(request, response, 'Successfully added list', 'success');
    }

    return respond(true);
  },
  delete: async (data, request, response) => {
    const userId = await requireUserId(request, response);
    const { type, id } = await validate(data, z.object({
      type: z.enum(['word', 'list']),
      id: z.string()
    }));

    const deleted = type === 'word' ? await db.word.delete({
      where: { id, userId }
    }) : await db.list.delete({
      where: { id, userId }
    });

    if (!deleted) {
      await setMessage(request, response, `Unable to remove ${type}`, 'error');

      return respond(false);
    }

    await setMessage(request, response, `Successfully removed ${type}`, 'success');

    return respond(true);
  }
});

export default function Index() {
  const { words, lists } = useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();
  const submit = useSubmit();
  const [open, close, withModal] = useModals<{
    word: Word | undefined,
    list: List | undefined
  }>();
  const [prompt, component] = useConfirmation<[string, string]>(([type]) => `Are you sure you want to delete this ${type}?`, ([type, id]) => {
    const data = new FormData();

    data.set('intent', 'delete');
    data.set('type', type);
    data.set('id', id);

    submit(data, {
      method: 'post'
    });
  });

  useEffect(() => {
    if (data?.success) {
      close();
    }
  }, [data]);

  return (
    <>
      <Header text="Words">
        <Button text="Add word" icon={faInputText} onClick={() => open('word', undefined)}/>
        <Button text="Add list" icon={faFolder} onClick={() => open('list', undefined)}/>
      </Header>
      <Container>
        <Lists
          lists={lists}
          open={(list) => open('list', list)}
          prompt={(id) => prompt(['list', id])}
        />
        <Words
          words={words}
          open={(word) => open('word', word)}
          prompt={(id) => prompt(['word', id])}
        />
      </Container>
      {withModal('word', (word) => (
        <UpsertWordModal word={word} lists={lists} onClose={close}/>
      ))}
      {withModal('list', (list) => (
        <UpsertListModal list={list} onClose={close}/>
      ))}
      {component}
    </>
  );
}
