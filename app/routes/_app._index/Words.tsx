import { faPenToSquare, faTimes } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Word } from '@prisma/client';

import { ItemList } from '~/components/ItemList';
import { Table } from '~/components/Table';
import { Tooltip } from '~/components/popovers/Tooltip';

type Props = {
  words: Word[];
  open: (word: Word) => void;
  prompt: (id: string) => void;
};

export function Words({ words, open, prompt }: Props) {
  return (
    <Table
      data={words}
      rowKey="id"
      columns={{
        word: {
          title: 'Word',
          render: (value) => value
        },
        definition: {
          title: 'Definition',
          render: (value) => value
        },
        id: {
          title: '',
          render: (value, row) => (
            <ItemList orientation="horizontal" palette="background" small={true}>
              <Tooltip content="Edit" asChild={true}>
                <button type="button" onClick={() => open(row)}>
                  <FontAwesomeIcon icon={faPenToSquare} />
                </button>
              </Tooltip>
              <Tooltip content="Remove" asChild={true}>
                <button type="button" onClick={() => prompt(value)}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </Tooltip>
            </ItemList>
          )
        }
      }}
    />
  );
}
