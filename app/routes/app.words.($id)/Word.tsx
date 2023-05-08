import { useDraggable } from '@dnd-kit/core';
import { faArrowRight, faGripDotsVertical } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Word as WordType } from '@prisma/client';

import styles from './Word.module.css';

import { useDropped } from '~/hooks/useDropped';
import { cs } from '~/utils/cs';

type Props = {
  word: WordType
};

export function Word({ word }: Props) {
  const { setNodeRef, isDragging, attributes, listeners, transform } = useDraggable({
    id: word.id,
    data: {
      kind: 'word'
    }
  });
  const dropped = useDropped(word.id);

  if (dropped) {
    return null;
  }

  return (
    <button
      className={cs(styles.wrapper, {
        [styles.dragging]: isDragging
      })}
      onClick={console.log}
    >
      <div
        ref={setNodeRef}
        style={!transform ? {} : {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
        }}
        className={cs(styles.word, {
          [styles.dragging]: isDragging
        })}
      >
        <span className={styles.handle} {...listeners} {...attributes}>
          <FontAwesomeIcon icon={faGripDotsVertical}/>
        </span>
        {word.left}
        <FontAwesomeIcon icon={faArrowRight}/>
        {word.right}
      </div>
      {word.type}
    </button>
  );
}
