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
import { AddFolderDialog } from '~/routes/app.words.($id)/AddFolderDialog';
import { AddWordDialog } from '~/routes/app.words.($id)/AddWordDialog';
import { Folder } from '~/routes/app.words.($id)/Folder';
import { Header } from '~/routes/app.words.($id)/Header';
import { WordList } from '~/routes/app.words.($id)/WordList';
import { requireUserId } from '~/session.server';
import { prismaResponse } from '~/utils/prismaResponse.server';
import { successResponse } from '~/utils/successResponse.server';
import { validate } from '~/utils/validate';

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
    async createFolder() {
      const data = await validate(request, {
        name: z.string().min(2),
        leftFlag: z.string().length(2).toUpperCase(),
        rightFlag: z.string().length(2).toUpperCase()
      });

      if (!data.success) {
        return data.response;
      }

      try {
        await prisma.folder.create({
          data: {
            user: {
              connect: { id: userId }
            },
            parent: !params.id ? undefined : {
              connect: { id: params.id }
            },
            name: data.data.name,
            leftFlag: data.data.leftFlag,
            rightFlag: data.data.rightFlag
          }
        });

        return successResponse({});
      } catch (e) {
        return prismaResponse(e);
      }
    },
    async createWord() {
      const data = await validate(request, {
        left: z.string().min(2),
        right: z.string().min(2),
        type: z.nativeEnum(WordType)
      });

      if (!data.success) {
        return data.response;
      }

      try {
        await prisma.word.create({
          data: {
            folder: {
              connect: { id: params.id }
            },
            left: data.data.left,
            right: data.data.right,
            type: data.data.type
          }
        });

        return successResponse({});
      } catch (e) {
        return prismaResponse(e);
      }
    },
    async completeDrag() {
      const data = await validate(request, {
        id: z.string(),
        kind: z.enum(['folder', 'word'] as const),
        targetId: z.string()
      });

      if (!data.success) {
        throw data.response;
      }

      try {
        if (data.data.kind === 'folder') {
          await prisma.folder.update({
            where: { id: data.data.id },
            data: {
              parent: data.data.targetId === 'root' ? {
                disconnect: true
              } : {
                connect: { id: data.data.targetId }
              }
            }
          });
        } else {
          await prisma.word.update({
            where: { id: data.data.id },
            data: {
              folder: {
                connect: { id: data.data.targetId }
              }
            }
          });
        }

        return successResponse({});
      } catch (e) {
        return prismaResponse(e);
      }
    }
  });
};

export default function Words() {
  const submit = useSubmit();
  const [, { open, close }] = useDialoog();

  const [loaderSuccess, loaderData] = useLoaderData<typeof loader>();
  const [actionSuccess, , actionErrors] = useActionData<typeof action>() ?? [];

  useFormErrors(actionErrors, true);
  useEffect(() => {
    if (actionSuccess) {
      close();
    }
  }, [actionSuccess, close]);

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
