import { faBook, faInputText, faTag } from '@fortawesome/pro-regular-svg-icons';
import { useState } from 'react';
import { redirect } from 'react-router';
import * as v from 'valibot';
import { optional } from 'valibot';
import { Table } from '~/components/Table.tsx';
import { TagSelect } from '~/components/TagSelect.tsx';
import { CreateTagDialog } from '~/components/dialogs/CreateTagDialog.tsx';
import { CreateWordDialog } from '~/components/dialogs/CreateWordDialog.tsx';
import { Button } from '~/components/forms/Button.tsx';
import { Form } from '~/components/forms/Form.tsx';
import { Select } from '~/components/forms/Select.tsx';
import { Container } from '~/components/layout/Container.tsx';
import { Header } from '~/components/layout/Header.tsx';
import { db } from '~/db.server.ts';
import { requireUser, requireUserId } from '~/session.server.ts';
import { actions, intent } from '~/utils/actions.server.ts';
import { findWordsForPractise } from '~/utils/practise.server.ts';
import type { Route } from './+types/_index.ts';
import styles from './_index.module.scss';

export const meta: Route.MetaFunction = () => [{ title: 'Overview / Glossify' }];

export const loader = async ({ request }: Route.LoaderArgs) => {
  const user = await requireUser(request);
  const languages = await db.language.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  });
  const words = await db.word.findMany({
    where: { user },
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
    where: { user },
    select: { id: true, name: true, parentId: true },
    orderBy: { name: 'asc' }
  });

  const language = languages.find((l) => l.id === user.languageId);

  if (!language) {
    throw new Error(`Invalid language: \`${user.languageId}\``);
  }

  return {
    language,
    languages: languages.filter((l) => l.id !== user.languageId),
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
        source: v.pipe(v.string(), v.minLength(1)),
        destination: v.pipe(v.string(), v.minLength(1)),
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
        name: v.pipe(v.string(), v.minLength(1)),
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
    ),
    intent(
      'startPractise',
      v.object({
        words: v.pipe(v.string(), v.transform(Number)),
        languageId: v.string(),
        tagIds: v.array(v.string())
      }),
      async (data) => {
        const words = await findWordsForPractise(data.words, data.languageId, data.tagIds);

        if (!words.length) {
          return { ok: false };
        }

        const tags = await db.tag.findMany({
          where: {
            id: { in: data.tagIds }
          },
          select: { name: true }
        });

        await db.practise.create({
          data: {
            name: tags.map((tag) => tag.name).join(' / '),
            userId,
            languageId: data.languageId,
            words: {
              createMany: {
                data: words.map((word) => ({
                  wordId: word.id
                }))
              }
            }
          }
        });

        throw redirect('/practises');
      }
    )
  ]);
};

export default function Component({ loaderData, actionData }: Route.ComponentProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  return (
    <>
      <Header text="Words">
        <CreateWordDialog languages={loaderData.languages} tags={loaderData.tags}>
          <Button text="Create word" icon={faInputText} />
        </CreateWordDialog>
        <CreateTagDialog tags={loaderData.tags}>
          <Button text="Create tag" icon={faTag} />
        </CreateTagDialog>
      </Header>
      <Container>
        <div className={styles.select}>
          <TagSelect tags={loaderData.tags} selected={selectedTags} setSelected={setSelectedTags} />
          <Select
            selectedKey={selectedLanguage}
            items={[{ id: '', name: 'All languages' }, ...loaderData.languages]}
            render={(language) => language.name}
            size="small"
            shape="round"
            variant="flat"
            palette="surface"
            aria-label="Language"
            onSelectionChange={(key) => setSelectedLanguage(String(key))}
          />
        </div>
        <Table
          rows={loaderData.words
            .filter((word) => selectedTags.every((s) => word.tagIds.includes(s)))
            .filter((word) => word.languageId.includes(selectedLanguage))}
          rowKey="id"
          columns={[
            {
              key: 'source',
              title: `${loaderData.language.name} word`,
              render: (row) => row.source
            },
            {
              key: 'destination',
              title: 'Foreign word',
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
        <Form method="post">
          <input type="hidden" name="words" value="10" />
          <input type="hidden" name="languageId" value={selectedLanguage} />
          {selectedTags.map((tagId) => (
            <input key={tagId} type="hidden" name="tagIds[]" value={tagId} />
          ))}
          <Button
            text="Start with these words"
            type="submit"
            icon={faBook}
            size="big"
            shape="round"
            name="intent"
            value="startPractise"
            isDisabled={!selectedLanguage}
          />
        </Form>
        <pre>{JSON.stringify(actionData, undefined, 2)}</pre>
      </Container>
    </>
  );
}
