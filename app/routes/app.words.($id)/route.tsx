import { faFilePlus, faFolderPlus } from '@fortawesome/pro-regular-svg-icons';
import { useActionData, useLoaderData } from '@remix-run/react';
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from '@vercel/remix';
import { redirect } from '@vercel/remix';
import { useDialoog } from 'dialoog';
import { useEffect } from 'react';
import { z } from 'zod';

import { Page } from '~/components/Page';
import { prisma } from '~/db.server';
import { useUser } from '~/hooks/useUser';
import { AddFolderDialog } from '~/routes/app.words.($id)/AddFolderDialog';
import { requireUserId } from '~/session.server';
import { successResponse } from '~/utils/successResponse';
import { validate } from '~/utils/validate';

export const meta: V2_MetaFunction = () => [{ title: 'Words | Glossify' }];

export const loader = async ({ params }: LoaderArgs) => {
  if (!params.id) {
    const folders = await prisma.folder.findMany({
      where: { parentId: null }
    });

    return successResponse(folders, 'root' as const);
  }

  const folder = await prisma.folder.findUnique({
    where: { id: params.id },
    include: { children: true }
  });

  if (!folder) {
    return redirect('/app/words');
  }

  return successResponse(folder, 'parent' as const);
};

export const action = async ({ params, request }: ActionArgs) => {
  const userId = await requireUserId(request);
  const data = await validate(request, {
    name: z.string(),
    leftFlag: z.string(),
    rightFlag: z.string()
  });

  if (!data.success) {
    return data.response;
  }

  const folder = await prisma.folder.create({
    data: {
      user: {
        connect: { id: userId }
      },
      name: data.data.name,
      leftFlag: data.data.leftFlag,
      rightFlag: data.data.rightFlag
    }
  });

  return successResponse(folder);
};

export default function Words() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const user = useUser();
  const [, { open, close }] = useDialoog();

  useEffect(() => {
    if (actionData?.success) {
      close();
    }
  }, [actionData, close]);

  return (
    <Page
      actions={[{
        text: 'Add word',
        icon: faFilePlus,
        iconOnly: 'laptop',
        disabled: true
      }, {
        text: 'Add folder',
        icon: faFolderPlus,
        iconOnly: 'laptop',
        onClick: open.c((props) => (
          <AddFolderDialog errors={actionData?.success === false ? actionData.errors : undefined} {...props}/>
        ))
      }]}
    >
      Welcome back, {user.username}
      {JSON.stringify(loaderData)}
    </Page>
  );
}
