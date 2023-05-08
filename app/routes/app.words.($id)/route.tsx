import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import { faFilePlus, faFolderPlus } from '@fortawesome/pro-regular-svg-icons';
import { WordType } from '@prisma/client';
import { useActionData, useLoaderData, useSubmit } from '@remix-run/react';
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@vercel/remix';
import { redirect } from '@vercel/remix';
import { useDialoog } from 'dialoog';
import { useEffect } from 'react';
import { ClientOnly, namedAction } from 'remix-utils';
import { z } from 'zod';

import { Page } from '~/components/Page';
import { Row } from '~/components/Row';
import { prisma } from '~/db.server';
import { useFormErrors } from '~/hooks/useFormErrors';
import { useNotifications } from '~/hooks/useNotifications';
import { Folder } from '~/routes/app.words.($id)/Folder';
import { Header } from '~/routes/app.words.($id)/Header';
import { WordList } from '~/routes/app.words.($id)/WordList';
import { AddFolderDialog } from '~/routes/app.words.($id)/dialogs/AddFolderDialog';
import { AddWordDialog } from '~/routes/app.words.($id)/dialogs/AddWordDialog';
import { requireUserId } from '~/session.server';
import { successResponse } from '~/utils/successResponse.server';
import { withData } from '~/utils/withData.server';

export const meta: V2_MetaFunction = () => [{ title: 'Words | Glossify' }];

export const loader = async ({ request, params }: LoaderArgs) => {
  const userId = await requireUserId(request);

  if (!params.id) {
    const folders = await prisma.folder.findMany({
      where: {
        userId,
        parentId: null
      },
      include: {
        _count: {
          select: { words: true, children: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    return successResponse(folders, 'root' as const);
  }

  const folder = await prisma.folder.findUnique({
    where: { id: params.id },
    include: {
      words: {
        orderBy: { left: 'asc' }
      },
      children: {
        include: {
          _count: {
            select: { words: true, children: true }
          }
        },
        orderBy: { name: 'asc' }
      },
      parent: {
        select: { id: true }
      }
    }
  });

  if (!folder || folder.userId !== userId) {
    return redirect('/app/words');
  }

  return successResponse(folder, 'parent' as const);
};

export const action = async ({ params, request }: ActionArgs) => {
  const userId = await requireUserId(request);

  return namedAction(request, {
    createFolder: withData(request, {
      name: z.string().min(2),
      leftFlag: z.string().length(2).toUpperCase(),
      rightFlag: z.string().length(2).toUpperCase()
    }, async (data) => {
      await prisma.folder.create({
        data: {
          user: {
            connect: { id: userId }
          },
          parent: !params.id ? undefined : {
            connect: { id: params.id }
          },
          name: data.name,
          leftFlag: data.leftFlag,
          rightFlag: data.rightFlag
        }
      });

      return 'Successfully created folder';
    }),
    createWork: withData(request, {
      left: z.string().min(2),
      right: z.string().min(2),
      type: z.nativeEnum(WordType)
    }, async (data) => {
      await prisma.word.create({
        data: {
          folder: {
            connect: { id: params.id }
          },
          left: data.left,
          right: data.right,
          type: data.type
        }
      });

      return 'Successfully created word';
    }),
    completeDrag: withData(request, {
      id: z.string(),
      kind: z.enum(['folder', 'word'] as const),
      targetId: z.string()
    }, async (data) => {
      if (data.kind === 'folder') {
        await prisma.folder.update({
          where: { id: data.id },
          data: {
            parent: data.targetId === 'root' ? {
              disconnect: true
            } : {
              connect: { id: data.targetId }
            }
          }
        });
      } else {
        await prisma.word.update({
          where: { id: data.id },
          data: {
            folder: {
              connect: { id: data.targetId }
            }
          }
        });
      }

      return `Successfully moved ${data.kind}`;
    })
  });
};

export default function Words() {
  const submit = useSubmit();
  const notify = useNotifications();
  const [, { open, close }] = useDialoog();

  const [loaderSuccess, loaderData] = useLoaderData<typeof loader>();
  const [actionSuccess, actionData, actionErrors] = useActionData<typeof action>() ?? [];

  useFormErrors(actionErrors, true);
  useEffect(() => {
    if (actionSuccess) {
      close();
    }

    if (actionData) {
      notify(actionData);
    }
  }, [actionSuccess, actionData, close, notify]);

  const folders = loaderSuccess === 'root' ? loaderData : loaderData.children;
  const handleDrop = (e: DragEndEvent) => {
    if (!e.over) {
      return;
    }

    submit({
      id: String(e.active.id),
      kind: e.active.data.current?.kind,
      targetId: String(e.over.id),
      action: 'completeDrag'
    }, { method: 'post' });
  };

  return (
    <Page
      actions={[{
        text: 'Add word',
        icon: faFilePlus,
        iconOnly: 'laptop',
        disabled: loaderSuccess !== 'parent',
        onClick: open.c((props) => loaderSuccess === 'parent' && (
          <AddWordDialog folder={loaderData} errors={actionErrors} {...props}/>
        ))
      }, {
        text: 'Add folder',
        icon: faFolderPlus,
        iconOnly: 'laptop',
        onClick: open.c((props) => (
          <AddFolderDialog errors={actionErrors} {...props}/>
        ))
      }]}
    >
      {loaderSuccess === 'root' && (
        <Header/>
      )}
      <ClientOnly>
        {() => (
          <DndContext onDragEnd={handleDrop}>
            <Row gap={1}>
              {loaderSuccess === 'parent' && (
                <Folder parentId={loaderData.parent?.id ?? null} folder={loaderData}/>
              )}
              {folders.map((folder) => (
                <Folder key={folder.id} folder={folder}/>
              ))}
            </Row>
            {loaderSuccess === 'parent' && Boolean(loaderData.words.length) && (
              <WordList words={loaderData.words}/>
            )}
          </DndContext>
        )}
      </ClientOnly>
    </Page>
  );
}
