import { faPenToSquare, faTimes } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { List } from '@prisma/client';

import styles from './Lists.module.scss';

import { ItemList } from '~/components/ItemList';
import { Grid } from '~/components/layout/Grid';
import { Tooltip } from '~/components/popovers/Tooltip';

type Props = {
  lists: (List & { _count: { words: number } })[],
  open: (list: List) => void,
  prompt: (id: string) => void
};

export function Lists({ lists, open, prompt }: Props) {
  return (
    <Grid columns={{ tablet: 2, laptop: 3, desktop: 4 }} gaps={{ phone: 1 }} asChild={true}>
      <div className={styles.grid}>
        {lists.map((list) => (
          <div key={list.id} className={styles.list}>
            {list.name} {list._count.words} words
            <ItemList orientation="horizontal" small={true}>
              <Tooltip content="Edit" asChild={true}>
                <button onClick={() => open(list)}>
                  <FontAwesomeIcon icon={faPenToSquare}/>
                </button>
              </Tooltip>
              <Tooltip content="Remove" asChild={true}>
                <button onClick={() => prompt(list.id)}>
                  <FontAwesomeIcon icon={faTimes}/>
                </button>
              </Tooltip>
            </ItemList>
          </div>
        ))}
      </div>
    </Grid>
  );
}
