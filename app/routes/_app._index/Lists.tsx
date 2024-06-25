import { faEye, faEyeSlash, faPenToSquare, faTimes } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { List } from '@prisma/client';
import { Link, createSearchParams, useSearchParams } from '@remix-run/react';

import styles from './Lists.module.scss';

import { ItemList } from '~/components/ItemList';
import { Grid } from '~/components/layout/Grid';
import { Tooltip } from '~/components/popovers/Tooltip';
import { withPalette } from '~/utils/withPalette';

type Props = {
  lists: (List & { _count: { words: number } })[];
  open: (list: List) => void;
  prompt: (id: string) => void;
};

export function Lists({ lists, open, prompt }: Props) {
  const [searchParams] = useSearchParams();

  return (
    <Grid columns={{ tablet: 2, laptop: 3, desktop: 4 }} gaps={{ phone: 1 }} asChild={true}>
      <div className={styles.grid}>
        {lists.map((list) => {
          const active = searchParams.get('list') === list.id;
          const palette = active ? 'surface-variant' : 'surface';
          const newParams = createSearchParams(searchParams);

          if (active) {
            newParams.delete('list');
          } else {
            newParams.set('list', list.id);
          }

          return (
            <div key={list.id} className={styles.list} style={withPalette(active ? 'surface-variant' : 'surface')}>
              {list.name}
              <div className={styles.subtitle}>{list._count.words} word(s)</div>
              <ItemList orientation="horizontal" palette={palette} small={true}>
                <Tooltip content={active ? 'Hide' : 'Show'} asChild={true}>
                  <Link to={{ search: newParams.toString() }}>
                    <FontAwesomeIcon icon={active ? faEyeSlash : faEye} />
                  </Link>
                </Tooltip>
                <Tooltip content="Edit" asChild={true}>
                  <button type="button" onClick={() => open(list)}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                </Tooltip>
                <Tooltip content="Remove" asChild={true}>
                  <button type="button" onClick={() => prompt(list.id)}>
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </Tooltip>
              </ItemList>
            </div>
          );
        })}
      </div>
    </Grid>
  );
}
