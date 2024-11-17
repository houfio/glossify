import { faAdd, faTag, faTimes } from '@fortawesome/pro-regular-svg-icons';
import type { Language, Tag } from '@prisma/client';
import { type PropsWithChildren, useId, useState } from 'react';
import { Form } from 'react-router';
import { TagSelect } from '~/components/TagSelect.tsx';
import { Dialog } from '~/components/dialogs/Dialog.tsx';
import { Button } from '~/components/forms/Button.tsx';
import { Input } from '~/components/forms/Input.tsx';
import { Select } from '~/components/forms/Select.tsx';
import { Grid } from '~/components/layout/Grid.tsx';
import styles from './CreateWordDialog.module.scss';

type Props = {
  languages: Pick<Language, 'id' | 'name'>[];
  tags: Pick<Tag, 'id' | 'name' | 'parentId'>[];
};

export function CreateWordDialog({ languages, tags, children }: PropsWithChildren<Props>) {
  const id = useId();
  const [selectedTags, setSelectedTags] = useState<string[][]>([]);

  const tagIds = [...new Set(selectedTags.flat())];

  return (
    <Dialog
      title="Create word"
      dialog={
        <Form method="post">
          <Grid gaps={{ phone: 1 }}>
            <Input label="Source" name="source" />
            <Input label="Destination" name="destination" />
            <Select label="Language" name="languageId" items={languages} render={(language) => language.name} />
            <div className={styles.tags}>
              <div className={styles.header}>
                Tags
                <Button
                  text="Add tags"
                  type="button"
                  icon={faAdd}
                  showText={false}
                  size="small"
                  variant="flat"
                  palette="accent"
                  onPress={() => setSelectedTags([...selectedTags, []])}
                />
              </div>
              {selectedTags.map((t, i) => (
                <div key={i} className={styles.row}>
                  <Button
                    text="Remove"
                    type="button"
                    icon={faTimes}
                    size="small"
                    palette="surface"
                    showText={false}
                    variant="flat"
                    onPress={() => setSelectedTags(selectedTags.filter((_, ii) => i !== ii))}
                  />
                  <TagSelect
                    tags={tags}
                    selected={t}
                    setSelected={(tt) => setSelectedTags(selectedTags.map((s, ii) => (i === ii ? tt : s)))}
                  />
                </div>
              ))}
              {tagIds.map((tagId) => (
                <input key={tagId} type="hidden" name="tagIds[]" value={tagId} />
              ))}
            </div>
            <Button text="Create word" type="submit" icon={faAdd} name="intent" value="createWord" />
          </Grid>
        </Form>
      }
    >
      {children}
    </Dialog>
  );
}
