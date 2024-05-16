import type { PropsWithChildren } from 'react';

import styles from './Dropdown.module.scss';

import { Popover } from '~/components/Popover';

type Props = {
  items: string[]
};

export function Dropdown({ items, children }: PropsWithChildren<Props>) {
  return (
    <Popover
      content={(
        <div className={styles.dropdown}>
          {items.map((item) => (
            <button key={item} autoFocus={true} className={styles.item}>
              {item}
            </button>
          ))}
        </div>
      )}
    >
      {children}
    </Popover>
  );
}
