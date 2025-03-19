import { faBook, faInputText, faTag } from '@fortawesome/pro-regular-svg-icons';
import { type } from 'arktype';
import { useState } from 'react';
import { redirect } from 'react-router';
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
import { getUser } from '~/middleware/user.ts';
import { actions, intent } from '~/utils/actions.server.ts';
import { findWordsForPractise } from '~/utils/practise.server.ts';
import type { Route } from './+types/_index.ts';
import styles from './_index.module.scss';

export async function loader({ context }: Route.LoaderArgs) {
  const user = getUser(context);
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
}

export function action({ request, context }: Route.ActionArgs) {
  const user = getUser(context);

  return actions(request, [
    intent(
      'createWord',
      type({
        source: 'string > 0',
        destination: 'string > 0',
        languageId: 'string',
        'tagIds?': 'string[]'
      }),
      (data) =>
        db.word.create({
          data: {
            source: data.source,
            destination: data.destination,
            languageId: data.languageId,
            tags: {
              connect: data.tagIds?.map((id) => ({ id }))
            },
            userId: user.id
          }
        })
    ),
    intent(
      'createTag',
      type({
        name: 'string > 0',
        parentId: 'string'
      }),
      (data) =>
        db.tag.create({
          data: {
            name: data.name,
            parentId: data.parentId || undefined,
            userId: user.id
          }
        })
    ),
    intent(
      'startPractise',
      type({
        words: 'string.numeric.parse',
        languageId: 'string',
        tagIds: 'string[]'
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
            userId: user.id,
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
}

export const handle = {
  title: 'Overview'
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
