import type { Word } from '@prisma/client';
import type { DialoogProps } from 'dialoog';

import { Dialog } from '~/components/dialogs/Dialog';

type Props = {
  word: Word
};

export function EditWordDialog({ word, ...props }: Props & DialoogProps) {
  return (
    <Dialog {...props}>
      {JSON.stringify(word)}
    </Dialog>
  );
}
