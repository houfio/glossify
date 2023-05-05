import { faAdd, faArrowRight, faFolderPlus } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CreateFolderInput, graphql } from '@glossify/schema';
import { DialoogProps } from 'dialoog';
import { useForm } from 'react-hook-form';
import { useMutation } from 'urql';

import { AddDialog } from '../../../components/dialogs/AddDialog.tsx';
import { Button } from '../../../components/forms/Button.tsx';
import { Form } from '../../../components/forms/Form.tsx';
import { Input } from '../../../components/forms/Input.tsx';
import { useNotifications } from '../../../hooks/useNotifications.tsx';

import styles from './AddFolderDialog.module.scss';

const mutation = graphql(`
  mutation CreateFolderMutation($input: CreateFolderInput!) {
    createFolder(input: $input) {
      id
    }
  }
`);

type Props = DialoogProps & {
  parentId?: string
};

export function AddFolderDialog({ parentId, ...props }: Props) {
  const form = useForm({
    defaultValues: {
      parentId,
      name: '',
      leftFlag: '',
      rightFlag: ''
    }
  });
  const [, mutate] = useMutation(mutation);
  const open = useNotifications();

  const add = (input: CreateFolderInput) => {
    mutate({ input })
      .then(({ data }) => {
        if (data) {
          open('Successfully added folder');

          props.close();
        } else {
          open('Whoops, something went wrong');
        }
      });
  };

  return (
    <AddDialog
      title="Add folder"
      subtitle="Add a folder that can contain sub-folders and words. All words directly in this folder share the same source and destination languages."
      icon={faFolderPlus}
      {...props}
    >
      <Form form={form} onSubmit={add}>
        <Input name="name" label="Name"/>
        <div className={styles.row}>
          <Input name="leftFlag" label="Source"/>
          <FontAwesomeIcon icon={faArrowRight}/>
          <Input name="rightFlag" label="Destination"/>
        </div>
        <Button text="Add" icon={faAdd}/>
      </Form>
    </AddDialog>
  );
}
