import { faPlus, faTimes } from '@fortawesome/pro-regular-svg-icons';
import { type PropsWithChildren, useState } from 'react';
import { TagSelect } from '~/components/TagSelect.tsx';
import { Dialog } from '~/components/dialogs/Dialog.tsx';
import { Button } from '~/components/forms/Button.tsx';
import { Combobox } from '~/components/forms/Combobox.tsx';
import { Form } from '~/components/forms/Form.tsx';
import { Input } from '~/components/forms/Input.tsx';
import { Grid } from '~/components/layout/Grid.tsx';
import type { Language, Tag } from '~/prisma/client.ts';
import styles from './CreateWordDialog.module.scss';

type Props = {
  languages: Pick<Language, 'id' | 'name'>[];
  tags: Pick<Tag, 'id' | 'name' | 'parentId'>[];
};

type KeyedList<T> = { value: T; key: string }[];

export function CreateWordDialog({ languages, tags, children }: PropsWithChildren<Props>) {
  const [selectedTags, setSelectedTags] = useState<KeyedList<string[]>>([]);

  const tagIds = [...new Set(selectedTags.flatMap((t) => t.value))];

  return (
    <Dialog
      title="Create word"
      dialog={
        <Form method="post">
          <Grid gaps={{ phone: 1 }}>
            <Input label="Source" name="source" />
            <Input label="Destination" name="destination" />
            <Combobox label="Language" name="languageId" items={languages} render={(language) => language.name} />
            <div className={styles.tags}>
              <div className={styles.header}>
                Tags
                <Button
                  text="Add"
                  type="button"
                  icon={faPlus}
                  size="small"
                  variant="flat"
                  palette="accent"
                  onPress={() => setSelectedTags([...selectedTags, { key: crypto.randomUUID(), value: [] }])}
                />
              </div>
              {selectedTags.map(({ key, value }) => (
                <div key={key} className={styles.row}>
                  <Button
                    text="Remove"
                    type="button"
                    icon={faTimes}
                    showText={false}
                    size="small"
                    palette="surface"
                    variant="flat"
                    onPress={() => setSelectedTags(selectedTags.filter((tag) => key !== tag.key))}
                  />
                  <TagSelect
                    tags={tags}
                    selected={value}
                    setSelected={(ids) =>
                      setSelectedTags(
                        selectedTags.map((tag) => {
                          if (key !== tag.key) {
                            return tag;
                          }

                          return { key, value: ids };
                        })
                      )
                    }
                  />
                </div>
              ))}
              {tagIds.map((tagId) => (
                <input key={tagId} type="hidden" name="tagIds[]" value={tagId} />
              ))}
            </div>
            <Button text="Create word" type="submit" icon={faPlus} name="intent" value="createWord" />
          </Grid>
        </Form>
      }
    >
      {children}
    </Dialog>
  );
}
