import { faArrowRight, faFolderPlus } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { DialoogProps } from 'dialoog';

import styles from './AddFolderDialog.module.css';

import { AddDialog } from '~/components/dialogs/AddDialog';
import { Input } from '~/components/forms/Input';
import type { FormErrors } from '~/types';

type Props = {
  errors?: FormErrors
};

export function AddFolderDialog({ errors, ...props }: Props & DialoogProps) {
  return (
    <AddDialog
      title="Add folder"
      subtitle="Add a folder that can contain sub-folders and words. All words directly in this folder share the same source and destination languages."
      icon={faFolderPlus}
      {...props}
    >
      <Input name="name" label="Name" errors={errors}/>
      <div className={styles.row}>
        <Input name="leftFlag" label="Source" errors={errors}/>
        <FontAwesomeIcon icon={faArrowRight}/>
        <Input name="rightFlag" label="Destination" errors={errors}/>
      </div>
    </AddDialog>
  );
}
