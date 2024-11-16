import { faChevronRight, faXmark } from '@fortawesome/pro-regular-svg-icons';
import type { Tag } from '@prisma/client';
import { useRef } from 'react';
import { Button } from '~/components/forms/Button.tsx';
import { type ImperativePopoverHandle, Popover } from '~/components/popovers/Popover.tsx';
import { type WithChildren, followPath } from '~/utils/trees.ts';
import styles from './TagSelect.module.scss';

type Props = {
  tags: WithChildren<Pick<Tag, 'id' | 'name'>>[];
  selected: string[];
  setSelected: (selected: string[]) => void;
};

export function TagSelect({ tags, selected, setSelected }: Props) {
  const ref = useRef<ImperativePopoverHandle>(null);

  const tree = followPath(tags, selected);
  const options = tree.length ? (tree[tree.length - 1]?.children ?? []) : tags;

  return (
    <div className={styles.row}>
      {tree.length ? (
        tree.map((tag, i) => (
          <div key={tag.id} className={styles.tag}>
            <span className={styles.name}>{tag.name}</span>
            <Button
              text="Remove"
              type="button"
              icon={faXmark}
              small={true}
              onClick={() => setSelected(selected.slice(0, i))}
            />
          </div>
        ))
      ) : (
        <span className={styles.empty}>(none)</span>
      )}
      {options.length > 0 && (
        <Popover
          ref={ref}
          content={
            <div className={styles.popover}>
              {options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={styles.option}
                  onClick={() => {
                    setSelected([...selected, option.id]);
                    ref.current?.hide();
                  }}
                >
                  {option.name}
                </button>
              ))}
            </div>
          }
          asChild={true}
        >
          <Button text="Specify tag" type="button" icon={faChevronRight} small={true} palette="surface" />
        </Popover>
      )}
    </div>
  );
}
