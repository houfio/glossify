import { faAdd, faFilePlus } from '@fortawesome/pro-regular-svg-icons';
import { CreateWordInput, FragmentType, graphql, useFragment, WordType } from '@glossify/schema';
import { DialoogProps } from 'dialoog';
import { useForm } from 'react-hook-form';
import { useMutation } from 'urql';

import { AddDialog } from '../../../components/dialogs/AddDialog.tsx';
import { Button } from '../../../components/forms/Button.tsx';
import { Form } from '../../../components/forms/Form.tsx';
import { Input } from '../../../components/forms/Input.tsx';
import { ParentFragment } from '../../../fragments.ts';
import { useNotifications } from '../../../hooks/useNotifications.tsx';

const mutation = graphql(`
  mutation CreateWordMutation($input: CreateWordInput!) {
    createWord(input: $input) {
      id
    }
  }
`);

type Props = DialoogProps & {
  folder: FragmentType<typeof ParentFragment>
};

export function AddWordDialog({ folder, ...props }: Props) {
  const folderData = useFragment(ParentFragment, folder);
  const form = useForm({
    defaultValues: {
      folderId: folderData.id,
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
        <Input name="left" label={`Source word (${folderData.leftFlag})`}/>
        <Input name="right" label={`Destination word (${folderData.rightFlag})`}/>
        <Button text="Add" icon={faAdd}/>
      </Form>
    </AddDialog>
  );
}
