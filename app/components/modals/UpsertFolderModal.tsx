import { faFloppyDisk, faPlus } from '@fortawesome/pro-regular-svg-icons';
import type { Folder } from '@prisma/client';

import { Button } from '~/components/forms/Button';
import { Form } from '~/components/forms/Form';
import { Input } from '~/components/forms/Input';
import { Modal } from '~/components/modals/Modal';

type Props = {
  folder?: Folder,
  onClose: () => void
};

export function UpsertFolderModal({ folder, onClose }: Props) {
  return (
    <Modal title={folder ? 'Update folder' : 'Add folder'} onClose={onClose}>
      <Form method="post">
        {folder && (
          <input name="id" value={folder.id} type="hidden"/>
        )}
        <Input name="name" label="Name" defaultValue={folder?.name} autofocus="true"/>
        <Button
          text={folder ? 'Save' : 'Add'}
          icon={folder ? faFloppyDisk : faPlus}
          type="submit"
          name="intent"
          value="upsertFolder"
        />
      </Form>
    </Modal>
  );
}
