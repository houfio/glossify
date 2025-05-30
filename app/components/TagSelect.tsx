import { faChevronRight, faXmark } from '@fortawesome/pro-regular-svg-icons';
import { Select as AriaSelect } from 'react-aria-components';
import { ListBox } from '~/components/ListBox.tsx';
import { Button } from '~/components/forms/Button.tsx';
import { Popover } from '~/components/popovers/Popover.tsx';
import type { Tag } from '~/prisma/client.ts';
import { arrayToTree, followPath } from '~/utils/trees.ts';
import styles from './TagSelect.module.scss';

type Props = {
  tags: Pick<Tag, 'id' | 'name' | 'parentId'>[];
  selected: string[];
  setSelected: (selected: string[]) => void;
};

export function TagSelect({ tags, selected, setSelected }: Props) {
  const tree = arrayToTree(tags);
  const path = followPath(tree, selected);
  const options = path.length ? (path[path.length - 1]?.children ?? []) : tree;

  return (
    <div className={styles.row}>
      {path.length ? (
        path.map((tag, i) => (
          <div key={tag.id} className={styles.tag}>
            <span className={styles.name}>{tag.name}</span>
            <Button
              text="Remove"
              type="button"
              icon={faXmark}
              size="small"
              shape="round"
              variant="flat"
              showText={false}
              onPress={() => setSelected(selected.slice(0, i))}
            />
          </div>
        ))
      ) : (
        <span className={styles.empty}>(none)</span>
      )}
      {options.length > 0 && (
        <AriaSelect aria-label="Add tag" onSelectionChange={(id) => setSelected([...selected, String(id)])}>
          <Button
            text="Add tag"
            icon={faChevronRight}
            showText={false}
            size="small"
            shape="round"
            variant="flat"
            palette="surface"
          />
          <Popover>
            <ListBox items={options} render={(option) => option.name} />
          </Popover>
        </AriaSelect>
      )}
    </div>
  );
}
