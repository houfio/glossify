import { faAdd, faFilePlus } from '@fortawesome/pro-regular-svg-icons';
import { CreateWordInput, graphql, WordType } from '@glossify/schema';
import { DialoogProps } from 'dialoog';
import { useForm } from 'react-hook-form';
import { useMutation } from 'urql';

import { AddDialog } from '../../../components/dialogs/AddDialog.tsx';
import { Button } from '../../../components/forms/Button.tsx';
import { Form } from '../../../components/forms/Form.tsx';
import { Input } from '../../../components/forms/Input.tsx';
import { useNotifications } from '../../../hooks/useNotifications.tsx';

const mutation = graphql(`
  mutation CreateWordMutation($input: CreateWordInput!) {
    createWord(input: $input) {
      id
    }
  }
`);

type Props = DialoogProps & {
  folderId: string
};

export function AddWordDialog({ folderId, ...props }: Props) {
  const form = useForm({
    defaultValues: {
      folderId,
      left: '',
      right: '',
      tagIds: [],
      type: WordType.Noun
    }
  });
  const [, mutate] = useMutation(mutation);
  const open = useNotifications();

  const add = (input: CreateWordInput) => {
    mutate({ input })
      .then(({ data }) => {
        if (data) {
          open('Successfully added word');

          props.close();
        } else {
          open('Whoops, something went wrong');
        }
      });
  };

  return (
    <AddDialog
      title="Add word"
      subtitle="Add a word with optionally its article. Source and destination languages are synchronized with the folder."
      icon={faFilePlus}
      {...props}
    >
      <Form form={form} onSubmit={add}>
        <Input name="left" label="Source word"/>
        <Input name="right" label="Destination word"/>
        <Button text="Add" icon={faAdd}/>
      </Form>
    </AddDialog>
  );
}
