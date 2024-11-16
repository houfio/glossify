import { faAdd, faTag, faTimes } from '@fortawesome/pro-regular-svg-icons';
import type { Language, Tag } from '@prisma/client';
import { useId, useState } from 'react';
import { Form } from 'react-router';
import { TagSelect } from '~/components/TagSelect.tsx';
import { Dialog } from '~/components/dialogs/Dialog.tsx';
import { Button } from '~/components/forms/Button.tsx';
import { Grid } from '~/components/layout/Grid.tsx';
import { arrayToTree } from '~/utils/trees.ts';
import styles from './CreateWordDialog.module.scss';

type Props = {
  languages: Pick<Language, 'id' | 'name'>[];
  tags: Pick<Tag, 'id' | 'name' | 'parentId'>[];
};

export function CreateWordDialog({ languages, tags }: Props) {
  const id = useId();
  const [selectedTags, setSelectedTags] = useState<string[][]>([[]]);

  const tagTree = arrayToTree(tags);
  const tagIds = [...new Set(selectedTags.flat())];

  return (
    <Dialog title="Create word">
      <Form method="post" className={styles.content}>
        <Grid gaps={{ phone: 1 }}>
          <label htmlFor={`${id}-source`}>Source</label>
          <input id={`${id}-source`} name="source" className={styles.input} />
          <label htmlFor={`${id}-destination`}>Destination</label>
          <input id={`${id}-destination`} name="destination" className={styles.input} />
          <label htmlFor={`${id}-languageId`}>Language</label>
          <select id={`${id}-languageId`} name="languageId" className={styles.input}>
            {languages.map((language) => (
              <option key={language.id} value={language.id}>
                {language.name}
              </option>
            ))}
          </select>
          <div className={styles.tags}>
            {selectedTags.map((t, i) => (
              <div key={i} className={styles.row}>
                <Button
                  text="Remove"
                  type="button"
                  icon={faTimes}
                  small={true}
                  palette="surface"
                  disabled={selectedTags.length === 1}
                  onClick={() => setSelectedTags(selectedTags.filter((_, ii) => i !== ii))}
                />
                <TagSelect
                  tags={tagTree}
                  selected={t}
                  setSelected={(tt) => setSelectedTags(selectedTags.map((s, ii) => (i === ii ? tt : s)))}
                />
              </div>
            ))}
            <Button
              text="Add tags"
              type="button"
              icon={faTag}
              palette="surface"
              className={styles.add}
              onClick={() => setSelectedTags([...selectedTags, []])}
            />
            {tagIds.map((tagId) => (
              <input key={tagId} type="hidden" name="tagIds[]" value={tagId} />
            ))}
          </div>
          <Button text="Create word" type="submit" icon={faAdd} name="intent" value="createWord" />
        </Grid>
      </Form>
    </Dialog>
  );
}
