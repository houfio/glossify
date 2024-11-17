import { faAdd, faTag } from '@fortawesome/pro-regular-svg-icons';
import { useEffect, useState } from 'react';
import * as v from 'valibot';
import { optional } from 'valibot';
import { Table } from '~/components/Table.tsx';
import { CreateWordDialog } from '~/components/dialogs/CreateWordDialog.tsx';
import { Button } from '~/components/forms/Button.tsx';
import { Container } from '~/components/layout/Container.tsx';
import { Header } from '~/components/layout/Header.tsx';
import { db } from '~/db.server.ts';
import { requireUserId } from '~/session.server.ts';
import { actions, intent } from '~/utils/actions.server.ts';
import type { Route } from './+types/_index.ts';
import { CreateTagDialog } from '~/components/dialogs/CreateTagDialog.tsx';
import { TagSelect } from '~/components/TagSelect.tsx';
import styles from './_index.module.scss';

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
    words: words.map(({ tags, ...word }) => ({
      ...word,
      tagIds: tags.map((tag) => tag.id)
    })),
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
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (actionData?.success) {
      close();
    }
  }, [actionData]);

  return (
    <>
      <Header text="Words">
        <CreateWordDialog languages={loaderData.languages} tags={loaderData.tags}>
          <Button text="Create word" icon={faAdd} />
        </CreateWordDialog>
        <CreateTagDialog tags={loaderData.tags}>
          <Button text="Create tag" icon={faTag} />
        </CreateTagDialog>
      </Header>
      <Container>
        <div className={styles.select}>
          <TagSelect tags={loaderData.tags} selected={selected} setSelected={setSelected} />
        </div>
        <Table
          rows={loaderData.words.filter((word) => selected.every((s) => word.tagIds.includes(s)))}
          rowKey="id"
          columns={[
            {
              key: 'source',
              title: 'Source',
              render: (row) => row.source
            },
            {
              key: 'destination',
              title: 'Destination',
              render: (row) => row.destination
            },
            {
              key: 'languageId',
              title: 'Language',
              render: (row) => loaderData.languages.find((l) => l.id === row.languageId)?.name
            }
          ]}
          aria-label="Words"
        />
        <pre>{JSON.stringify(actionData, undefined, 2)}</pre>
      </Container>
    </>
  );
}
