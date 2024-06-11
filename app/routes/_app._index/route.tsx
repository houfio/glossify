import { faFolder, faInputText, faPenToSquare, faTimes } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Folder, Word } from '@prisma/client';
import { useLoaderData, useSubmit } from '@remix-run/react';
import { unstable_defineLoader } from '@vercel/remix';
import { z } from 'zod';

import styles from './route.module.scss';

import { ItemList } from '~/components/ItemList';
import { Table } from '~/components/Table';
import { Button } from '~/components/forms/Button';
import { Container } from '~/components/layout/Container';
import { Grid } from '~/components/layout/Grid';
import { Header } from '~/components/layout/Header';
import { UpsertFolderModal } from '~/components/modals/UpsertFolderModal';
import { UpsertWordModal } from '~/components/modals/UpsertWordModal';
import { Tooltip } from '~/components/popovers/Tooltip';
import { db } from '~/db.server';
import { useConfirmation } from '~/hooks/useConfirmation';
import { useModals } from '~/hooks/useModals';
import { requireUserId, setMessage } from '~/session.server';
import { createActions } from '~/utils/createActions.server';
import { respond } from '~/utils/respond.server';
import { validate } from '~/utils/validate.server';

export const loader = unstable_defineLoader(async ({ request, response }) => {
  const userId = await requireUserId(request, response);
  const { words, folders } = await db.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      words: {
        orderBy: { word: 'asc' }
      },
      folders: {
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

  return { words, folders };
});

export const action = createActions({
  upsertWord: async (data, request, response) => {
    const userId = await requireUserId(request, response);
    const { id, word, definition, folderId } = await validate(data, z.object({
      id: z.string().optional(),
      word: z.string().trim().min(1),
      definition: z.string().trim().min(1),
      folderId: z.string()
    }));

    if (id) {
      const value = await db.word.update({
        where: { id, userId },
        data: {
          word,
          definition,
          folder: folderId ? {
            connect: { id: folderId }
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
          folderId: folderId || undefined
        }
      });

      await setMessage(request, response, 'Successfully added word', 'success');
    }

    return respond(true);
  },
  upsertFolder: async (data, request, response) => {
    const userId = await requireUserId(request, response);
    const { id, name } = await validate(data, z.object({
      id: z.string().optional(),
      name: z.string().trim().min(1)
    }));

    if (id) {
      const value = await db.folder.update({
        where: { id, userId },
        data: { name }
      });

      if (!value) {
        await setMessage(request, response, 'Unable to update folder', 'error');

        return respond(false);
      }

      await setMessage(request, response, 'Successfully updated folder', 'success');
    } else {
      await db.folder.create({
        data: {
          userId,
          name
        }
      });

      await setMessage(request, response, 'Successfully added folder', 'success');
    }

    return respond(true);
  },
  delete: async (data, request, response) => {
    const userId = await requireUserId(request, response);
    const { type, id } = await validate(data, z.object({
      type: z.enum(['word', 'folder']),
      id: z.string()
    }));

    const deleted = type === 'word' ? await db.word.delete({
      where: { id, userId }
    }) : await db.folder.delete({
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
  const { words, folders } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const [open, close, withModal] = useModals<{
    word: Word | undefined,
    folder: Folder | undefined
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

  return (
    <>
      <Header text="Words">
        <Button text="Add word" icon={faInputText} onClick={() => open('word', undefined)}/>
        <Button text="Add folder" icon={faFolder} onClick={() => open('folder', undefined)}/>
      </Header>
      <Container>
        <Grid columns={{ phone: 3 }} gaps={{ phone: 1 }}>
          {folders.map((folder) => (
            <div key={folder.id} className={styles.folder}>
              {folder.name} {folder._count.words}
              <ItemList orientation="horizontal" small={true}>
                <Tooltip content="Edit" asChild={true}>
                  <button onClick={() => open('folder', folder)}>
                    <FontAwesomeIcon icon={faPenToSquare}/>
                  </button>
                </Tooltip>
                <Tooltip content="Remove" asChild={true}>
                  <button onClick={() => prompt(['folder', folder.id])}>
                    <FontAwesomeIcon icon={faTimes}/>
                  </button>
                </Tooltip>
              </ItemList>
            </div>
          ))}
        </Grid>
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
                  <Tooltip content="Edit" asChild={true}>
                    <button onClick={() => open('word', row)}>
                      <FontAwesomeIcon icon={faPenToSquare}/>
                    </button>
                  </Tooltip>
                  <Tooltip content="Remove" asChild={true}>
                    <button onClick={() => prompt(['word', value])}>
                      <FontAwesomeIcon icon={faTimes}/>
                    </button>
                  </Tooltip>
                </ItemList>
              )
            }
          }}
        />
      </Container>
      {withModal('word', (word) => (
        <UpsertWordModal word={word} folders={folders} onClose={close}/>
      ))}
      {withModal('folder', (folder) => (
        <UpsertFolderModal folder={folder} onClose={close}/>
      ))}
      {component}
    </>
  );
}
