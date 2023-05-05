import { useDraggable, useDroppable } from '@dnd-kit/core';
import {
  faArrowRight,
  faFile,
  faFolder,
  faFolderOpen,
  faGripDotsVertical
} from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FragmentType, graphql, useFragment } from '@glossify/schema';
import { Link } from 'react-router-dom';

import { cs } from '../../../utils/cs.ts';

import styles from './FolderCard.module.scss';

const FolderFragment = graphql(`
  fragment FolderFragment on Folder {
    id
    name
    leftFlag
    rightFlag
    words {
      id
    }
    children {
      id
    }
  }
`);

const ParentFragment = graphql(`
  fragment ParentFragment on Folder {
    name
    parent {
      id
    }
  }
`);

type Props = {
  folder?: FragmentType<typeof FolderFragment>,
  parent?: FragmentType<typeof ParentFragment>
};

export function FolderCard({ folder, parent }: Props) {
  const folderData = useFragment(FolderFragment, folder);
  const parentData = useFragment(ParentFragment, parent);
  const { setNodeRef: setDraggableRef, isDragging, attributes, listeners, transform, active } = useDraggable({
    id: folderData?.id ?? '',
    disabled: !folderData
  });
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: folderData?.id ?? parentData?.parent?.id ?? '',
    disabled: !!folderData && active?.id === folderData.id
  });

  return (
    <div
      ref={setDraggableRef}
      style={!transform ? {} : {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
      }}
      className={cs(styles.wrapper, {
        [styles.dragging]: isDragging,
        [styles.over]: isOver
      })}
    >
      {folderData && (
        <span className={styles.handle} {...listeners} {...attributes}>
          <FontAwesomeIcon icon={faGripDotsVertical}/>
        </span>
      )}
      <Link
        ref={setDroppableRef}
        to={folderData ? `/folders/${folderData.id}` : `/folders${parentData?.parent?.id ? `/${parentData.parent.id}` : ''}`}
        className={cs(styles.card, {
          [styles.dragging]: isDragging,
          [styles.parent]: !folderData
        })}
      >
        {folderData ? (
          <>
            <div>
              <span className={styles.title}>
                {folderData.name}
              </span>
              <div className={styles.subtitle}>
                {folderData.leftFlag}
                <FontAwesomeIcon icon={faArrowRight} size="xs"/>
                {folderData.rightFlag}
              </div>
            </div>
            <div className={cs(styles.details, styles.end)}>
              {Boolean(folderData.words.length) && (
                <div>
                  <FontAwesomeIcon icon={faFile}/> {folderData.words.length}
                </div>
              )}
              {Boolean(folderData.children.length) && (
                <div>
                  <FontAwesomeIcon icon={faFolder}/> {folderData.children.length}
                </div>
              )}
            </div>
          </>
        ) : (
          <span className={styles.details}>
            <FontAwesomeIcon icon={faFolderOpen}/>
            {parentData?.name}
          </span>
        )}
      </Link>
    </div>
  );
}
