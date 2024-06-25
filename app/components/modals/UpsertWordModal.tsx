import { faFloppyDisk, faPlus } from '@fortawesome/pro-regular-svg-icons';
import type { List, Word } from '@prisma/client';

import { Button } from '~/components/forms/Button';
import { Form } from '~/components/forms/Form';
import { Input } from '~/components/forms/Input';
import { Select } from '~/components/forms/Select';
import { Modal } from '~/components/modals/Modal';

type Props = {
  word?: Word;
  lists: List[];
};

export function UpsertWordModal({ word, lists }: Props) {
  return (
    <Modal title={word ? 'Update word' : 'Add word'}>
      <Form method="post">
        {word && <input name="id" value={word.id} type="hidden" />}
        <Input name="word" label="To study" defaultValue={word?.word} autofocus="true" />
        <Input name="definition" label="Definition" defaultValue={word?.definition} />
        <Select
          name="listId"
          label="List"
          options={[
            {
              value: '',
              label: ''
            },
            ...lists.map((list) => ({
              value: list.id,
              label: list.name
            }))
          ]}
          defaultValue={word?.listId ?? ''}
        />
        <Button
          text={word ? 'Save' : 'Add'}
          icon={word ? faFloppyDisk : faPlus}
          type="submit"
          name="intent"
          value="upsertWord"
        />
      </Form>
    </Modal>
  );
}
