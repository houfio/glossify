import { faFloppyDisk, faPlus } from '@fortawesome/pro-regular-svg-icons';
import type { Word } from '@prisma/client';

import { Button } from '~/components/forms/Button';
import { Form } from '~/components/forms/Form';
import { Input } from '~/components/forms/Input';
import { Modal } from '~/components/modals/Modal';

type Props = {
  word?: Omit<Word, 'userId'>,
  onClose: () => void
};

export function UpsertWordModal({ word, onClose }: Props) {
  return (
    <Modal title={word ? 'Update word' : 'Add word'} onClose={onClose}>
      <Form method="post">
        {word && (
          <input name="id" value={word.id} type="hidden"/>
        )}
        <Input name="word" label="To study" defaultValue={word?.word} autofocus="true"/>
        <Input name="definition" label="Definition" defaultValue={word?.definition}/>
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
