import { useEffect, useState } from 'react';
import { Form } from 'react-router';
import * as v from 'valibot';
import { optional } from 'valibot';
import { TagSelect } from '~/components/TagSelect.tsx';
import { CreateWordDialog } from '~/components/dialogs/CreateWordDialog.tsx';
import { Button } from '~/components/forms/Button.tsx';
import { Container } from '~/components/layout/Container.tsx';
import { db } from '~/db.server.ts';
import { useDialogs } from '~/hooks/useDialogs.tsx';
import { requireUserId } from '~/session.server.ts';
import { actions, intent } from '~/utils/actions.server.ts';
import { arrayToTree } from '~/utils/trees.ts';
import type { Route } from './+types/_index.ts';
import { Header } from '~/components/layout/Header.tsx';
import { Table } from '~/components/Table.tsx';

export const meta: Route.MetaFunction = () => [{ title: 'Overview / Glossify' }];

export const loader = async ({ request }: Route.LoaderArgs) => {
  const userId = await requireUserId(request);
  const languages = await db.language.findMany({
    select: { id: true, name: true },
    where: {
      users: {
        none: { id: userId }
      }
    },
    orderBy: { name: 'asc' }
  });
  const words = await db.word.findMany({
    where: { userId },
    select: {
      id: true,
      source: true,
      destination: true,
      languageId: true,
      tags: {
        select: { id: true }
      }
    },
    orderBy: { source: 'asc' }
  });
  const tags = await db.tag.findMany({
    where: { userId },
    select: { id: true, name: true, parentId: true },
    orderBy: { name: 'asc' }
  });

  return {
    languages,
    words,
    tags
  };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const userId = await requireUserId(request);

  return await actions(request, [
    intent(
      'createWord',
      v.object({
        source: v.string(),
        destination: v.string(),
        languageId: v.string(),
        tagIds: optional(v.array(v.string()), [])
      }),
      (data) =>
        db.word.create({
          data: {
            source: data.source,
            destination: data.destination,
            languageId: data.languageId,
            tags: {
              connect: data.tagIds.map((id) => ({ id }))
            },
            userId
          }
        })
    ),
    intent(
      'createTag',
      v.object({
        name: v.string(),
        parentId: v.string()
      }),
      (data) =>
        db.tag.create({
          data: {
            name: data.name,
            parentId: data.parentId || undefined,
            userId
          }
        })
    )
  ]);
};

export default function Component({ loaderData, actionData }: Route.ComponentProps) {
  const [open, close, component] = useDialogs({
    createWord: () => <CreateWordDialog languages={loaderData.languages} tags={loaderData.tags} />
  });
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (actionData?.success) {
      close();
    }
  }, [actionData]);

  return (
    <>
      <Header text="Words">
        <Button text="Create word" onClick={() => open('createWord')} />
      </Header>
      <Container>
        <Table
          data={loaderData.words}
          rowKey="id"
          columns={{
            source: {
              title: 'Source',
              render: (value) => value
            },
            destination: {
              title: 'Destination',
              render: (value) => value
            },
            languageId: {
              title: 'Language',
              render: (value) => loaderData.languages.find((l) => l.id === value)?.name
            },
            tags: {
              title: 'Tags',
              render: (value) => value
                .map((t) => loaderData.tags.find((tt) => t.id === tt.id))
                .filter((t) => t !== undefined)
                .map((t) => t.name)
                .join(', ')
            }
          }}
        />
      </Container>
      <Header text="Tags"/>
      <Container>
        <Form method="post">
          <input name="name" />
          <input type="hidden" name="parentId" value={selected.length ? selected[selected.length - 1] : ''} />
          <button type="submit" name="intent" value="createTag">
            Create tag
          </button>
          <TagSelect tags={arrayToTree(loaderData.tags)} selected={selected} setSelected={setSelected} />
        </Form>
        <pre>{JSON.stringify(actionData, undefined, 2)}</pre>
      </Container>
      {component}
    </>
  );
}
