import { faFloppyDisk, faPlus } from '@fortawesome/pro-regular-svg-icons';
import type { List } from '@prisma/client';

import { Button } from '~/components/forms/Button';
import { Form } from '~/components/forms/Form';
import { Input } from '~/components/forms/Input';
import { Modal } from '~/components/modals/Modal';

type Props = {
  list?: List,
  onClose: () => void
};

export function UpsertListModal({ list, onClose }: Props) {
  return (
    <Modal title={list ? 'Update list' : 'Add list'} onClose={onClose}>
      <Form method="post">
        {list && (
          <input name="id" value={list.id} type="hidden"/>
        )}
        <Input name="name" label="Name" defaultValue={list?.name} autofocus="true"/>
        <Button
          text={list ? 'Save' : 'Add'}
          icon={list ? faFloppyDisk : faPlus}
          type="submit"
          name="intent"
          value="upsertList"
        />
      </Form>
    </Modal>
  );
}
