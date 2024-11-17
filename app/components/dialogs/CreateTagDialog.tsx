import type { Tag } from '@prisma/client';
import { type PropsWithChildren, useState } from 'react';
import { Dialog } from '~/components/dialogs/Dialog.tsx';
import { TagSelect } from '~/components/TagSelect.tsx';
import { Form } from 'react-router';

type Props = {
  tags: Pick<Tag, 'id' | 'name' | 'parentId'>[];
};

export function CreateTagDialog({ tags, children }: PropsWithChildren<Props>) {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <Dialog
      title="Create tag"
      dialog={
        <Form method="post">
          <input name="name" />
          <input type="hidden" name="parentId" value={selected.length ? selected[selected.length - 1] : ''} />
          <button type="submit" name="intent" value="createTag">
            Create tag
          </button>
          <TagSelect tags={tags} selected={selected} setSelected={setSelected} />
        </Form>
      }
    >
      {children}
    </Dialog>
  );
}
