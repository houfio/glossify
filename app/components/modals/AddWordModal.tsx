import { faPlus } from '@fortawesome/pro-regular-svg-icons';

import { Button } from '~/components/forms/Button';
import { Form } from '~/components/forms/Form';
import { Input } from '~/components/forms/Input';
import { Modal } from '~/components/modals/Modal';

type Props = {
  onClose: () => void
};

export function AddWordModal({ onClose }: Props) {
  return (
    <Modal title="Add word" onClose={onClose}>
      <Form method="post">
        <Input name="word" label="To study" autofocus="true"/>
        <Input name="definition" label="Definition"/>
        <Button
          text="Add"
          icon={faPlus}
          type="submit"
          name="intent"
          value="createWord"
        />
      </Form>
    </Modal>
  );
}
