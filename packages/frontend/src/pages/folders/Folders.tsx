import { DndContext } from '@dnd-kit/core';
import { faFilePlus, faFolderPlus } from '@fortawesome/pro-regular-svg-icons';
import { graphql } from '@glossify/schema';
import { useDialoog } from 'dialoog';
import { useParams } from 'react-router';
import { useQuery } from 'urql';

import { Column } from '../../components/Column.tsx';
import { Page } from '../../components/Page.tsx';
import { Row } from '../../components/Row.tsx';

import styles from './Folders.module.scss';
import { AddFolderDialog } from './components/AddFolderDialog.tsx';
import { AddWordDialog } from './components/AddWordDialog.tsx';
import { FolderCard } from './components/FolderCard.tsx';
import { Notifications } from './components/Notifications.tsx';
import { Word } from './components/Word.tsx';

const query = graphql(`
  query FoldersQuery($id: ID!, $root: Boolean!) {
    me @include(if: $root) {
      id
      username
      folders {
        id
        ...FolderFragment
      }
    }
    folder(id: $id) @skip(if: $root) {
      id
      children {
        id
        ...FolderFragment
      }
      words {
        id
        ...WordFragment
      }
      ...ParentFragment
    }
  }
`);

export function Folders() {
  const params = useParams<{ id?: string }>();
  const [data] = useQuery({
    query,
    variables: { id: params.id ?? '', root: !params.id }
  });
  const [, { open }] = useDialoog();

  const folders = data.data?.me?.folders ?? data.data?.folder?.children ?? [];
  const folder = data.data?.folder;

  return (
    <Page
      actions={[{
        text: 'Add word',
        icon: faFilePlus,
        iconOnly: 'laptop',
        disabled: !params.id,
        onClick: folder && open.c((props) => (
          <AddWordDialog
            folder={folder}
            {...props}
          />
        ))
      }, {
        text: 'Add folder',
        icon: faFolderPlus,
        iconOnly: 'laptop',
        onClick: open.c((props) => (
          <AddFolderDialog parentId={params.id} {...props}/>
        ))
      }]}
    >
      {data.data?.me && (
        <div className={styles.jumbo}>
          <div className={styles.title}>
            Welcome back, {data.data.me.username}
          </div>
          <Row spaces={{ phone: 1 }}>
            <Column columns={{ phone: 12, laptop: 6 }}>
              <Notifications/>
            </Column>
          </Row>
        </div>
      )}
      <DndContext>
        <Row spaces={{ phone: 1 }}>
          {data.data?.folder && (
            <Column columns={{ phone: 6, tablet: 4, desktop: 3 }}>
              <FolderCard parent={data.data.folder}/>
            </Column>
          )}
          {folders.map((folder) => (
            <Column key={folder.id} columns={{ phone: 6, tablet: 4, desktop: 3 }}>
              <FolderCard folder={folder}/>
            </Column>
          ))}
        </Row>
        {folder && (
          <>
            <div className={styles.words}>
              Words
            </div>
            {folder.words.map((word) => (
              <Word key={word.id} word={word}/>
            ))}
          </>
        )}
      </DndContext>
    </Page>
  );
}
