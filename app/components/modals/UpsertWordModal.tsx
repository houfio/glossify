import { faFloppyDisk, faPlus } from '@fortawesome/pro-regular-svg-icons';
import type { Folder, Word } from '@prisma/client';

import { Button } from '~/components/forms/Button';
import { Form } from '~/components/forms/Form';
import { Input } from '~/components/forms/Input';
import { Select } from '~/components/forms/Select';
import { Modal } from '~/components/modals/Modal';

type Props = {
  word?: Word,
  folders: Folder[],
  onClose: () => void
};

export function UpsertWordModal({ word, folders, onClose }: Props) {
  return (
    <Modal title={word ? 'Update word' : 'Add word'} onClose={onClose}>
      <Form method="post">
        {word && (
          <input name="id" value={word.id} type="hidden"/>
        )}
        <Input name="word" label="To study" defaultValue={word?.word} autofocus="true"/>
        <Input name="definition" label="Definition" defaultValue={word?.definition}/>
        <Select
          name="folderId"
          label="folder"
          options={[
            {
              value: '',
              label: ''
            },
            ...folders.map((folder) => ({
              value: folder.id,
              label: folder.name
            }))
          ]}
          defaultValue={word?.folderId ?? ''}
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
