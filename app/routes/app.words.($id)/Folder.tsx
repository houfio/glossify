import { useDraggable, useDroppable } from '@dnd-kit/core';
import { faArrowRight, faFile, faFolder, faFolderOpen, faGripDotsVertical } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Folder as FolderType } from '@prisma/client';
import { Link } from '@remix-run/react';

import styles from './Folder.module.css';

import { useDropped } from '~/hooks/useDropped';
import { cs } from '~/utils/cs';

type Props = {
  folder: FolderType & {
    _count?: { words: number, children: number }
  },
  parentId?: string | null
};

export function Folder({ folder, parentId }: Props) {
  const { setNodeRef: setDraggableRef, isDragging, attributes, listeners, transform, active } = useDraggable({
    id: folder.id,
    disabled: parentId !== undefined,
    data: {
      kind: 'folder'
    }
  });
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: parentId !== undefined ? (parentId ?? 'root') : folder.id,
    disabled: active?.id === folder.id || (parentId === null && active?.data.current?.kind === 'word')
  });
  const dropped = useDropped(folder.id);

  if (dropped) {
    return null;
  }

  const targetId = parentId !== undefined ? parentId : folder.id;

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
      {parentId === undefined && (
        <span className={styles.handle} {...listeners} {...attributes}>
          <FontAwesomeIcon icon={faGripDotsVertical}/>
        </span>
      )}
      <Link
        ref={setDroppableRef}
        to={`/app/words${targetId ? `/${targetId}` : ''}`}
        className={cs(styles.card, {
          [styles.parent]: parentId !== undefined
        })}
      >
        {parentId !== undefined ? (
          <span className={styles.details}>
            <FontAwesomeIcon icon={faFolderOpen}/>
            {folder.name}
          </span>
        ) : (
          <>
            <div>
              <span className={styles.title}>
                {folder.name}
              </span>
              <div className={styles.subtitle}>
                {folder.leftFlag}
                <FontAwesomeIcon icon={faArrowRight} size="xs"/>
                {folder.rightFlag}
              </div>
            </div>
            <div className={cs(styles.details, styles.end)}>
              {Boolean(folder._count?.words) && (
                <div>
                  <FontAwesomeIcon icon={faFile}/> {folder._count?.words}
                </div>
              )}
              {Boolean(folder._count?.children) && (
                <div>
                  <FontAwesomeIcon icon={faFolder}/> {folder._count?.children}
                </div>
              )}
            </div>
          </>
        )}
      </Link>
    </div>
  );
}
