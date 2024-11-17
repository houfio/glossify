import { faAdd } from '@fortawesome/pro-regular-svg-icons';
import type { Tag } from '@prisma/client';
import { type PropsWithChildren, useState } from 'react';
import { TagSelect } from '~/components/TagSelect.tsx';
import { Dialog } from '~/components/dialogs/Dialog.tsx';
import { Button } from '~/components/forms/Button.tsx';
import { Form } from '~/components/forms/Form.tsx';
import { Input } from '~/components/forms/Input.tsx';
import { Grid } from '~/components/layout/Grid.tsx';

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
          <Grid gaps={{ phone: 1 }}>
            <Input name="name" label="Name" />
            <input type="hidden" name="parentId" value={selected.length ? selected[selected.length - 1] : ''} />
            Parent
            <TagSelect tags={tags} selected={selected} setSelected={setSelected} />
            <Button text="Create tag" type="submit" icon={faAdd} name="intent" value="createTag" />
          </Grid>
        </Form>
      }
    >
      {children}
    </Dialog>
  );
}
