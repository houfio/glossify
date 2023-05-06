import { faFilePlus } from '@fortawesome/pro-regular-svg-icons';
import type { Folder } from '@prisma/client';
import type { DialoogProps } from 'dialoog';

import { AddDialog } from '~/components/dialogs/AddDialog';
import { Input } from '~/components/forms/Input';
import type { FormErrors } from '~/types';

type Props = {
  folder: Folder,
  errors?: FormErrors
};

export function AddWordDialog({ folder, errors, ...props }: Props & DialoogProps) {
  return (
    <AddDialog
      title="Add word"
      subtitle="Add a word with optionally its article. Source and destination languages are synchronized with the folder."
      icon={faFilePlus}
      {...props}
    >
      <Input name="left" label={`Source word (${folder.leftFlag})`} errors={errors}/>
      <Input name="right" label={`Destination word (${folder.rightFlag})`} errors={errors}/>
      <input type="hidden" name="type" value="NOUN"/>
      <input type="hidden" name="action" value="createWord"/>
    </AddDialog>
  );
}
