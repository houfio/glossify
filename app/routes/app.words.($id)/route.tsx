import { DndContext } from '@dnd-kit/core';
import { faFilePlus, faFolderPlus } from '@fortawesome/pro-regular-svg-icons';
import { useActionData, useLoaderData } from '@remix-run/react';
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@vercel/remix';
import { redirect } from '@vercel/remix';
import { useDialoog } from 'dialoog';
import { useEffect } from 'react';
import { ClientOnly } from 'remix-utils';
import { z } from 'zod';

import { Page } from '~/components/Page';
import { Row } from '~/components/Row';
import { prisma } from '~/db.server';
import { useFormErrors } from '~/hooks/useFormErrors';
import { useUser } from '~/hooks/useUser';
import { AddFolderDialog } from '~/routes/app.words.($id)/AddFolderDialog';
import { Folder } from '~/routes/app.words.($id)/Folder';
import { requireUserId } from '~/session.server';
import { errorResponse } from '~/utils/errorResponse.server';
import { successResponse } from '~/utils/successResponse.server';
import { validate } from '~/utils/validate';

export const meta: V2_MetaFunction = () => [{ title: 'Words | Glossify' }];

export const loader = async ({ params }: LoaderArgs) => {
  if (!params.id) {
    const folders = await prisma.folder.findMany({
      where: { parentId: null },
      include: {
        _count: {
          select: { words: true, children: true }
        }
      }
    });

    return successResponse(folders, 'root' as const);
  }

  const folder = await prisma.folder.findUnique({
    where: { id: params.id },
    include: {
      children: {
        include: {
          _count: {
            select: { words: true, children: true }
          }
        }
      },
      parent: {
        select: {
          id: true
        }
      }
    }
  });

  if (!folder) {
    return redirect('/app/words');
  }

  return successResponse(folder, 'parent' as const);
};

export const action = async ({ params, request }: ActionArgs) => {
  const userId = await requireUserId(request);
  const data = await validate(request, {
    name: z.string().min(2),
    leftFlag: z.string().length(2).toUpperCase(),
    rightFlag: z.string().length(2).toUpperCase()
  });

  if (!data.success) {
    return data.response;
  }

  try {
    const folder = await prisma.folder.create({
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

    return successResponse(folder);
  } catch {
    return errorResponse();
  }
};

export default function Words() {
  const user = useUser();
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

  return (
    <Page
      actions={[{
        text: 'Add word',
        icon: faFilePlus,
        iconOnly: 'laptop',
        disabled: loaderSuccess !== 'parent'
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
        <>
          Welcome back, {user.username}
        </>
      )}
      <ClientOnly>
        {() => (
          <DndContext>
            <Row gap={1}>
              {loaderSuccess === 'parent' && (
                <Folder parentId={loaderData.parent?.id ?? null} folder={loaderData}/>
              )}
              {folders.map((folder) => (
                <Folder key={folder.id} folder={folder}/>
              ))}
            </Row>
          </DndContext>
        )}
      </ClientOnly>
    </Page>
  );
}
