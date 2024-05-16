import { Link } from '@remix-run/react';
import type { To } from '@remix-run/router';
import type { PropsWithChildren } from 'react';

import styles from './Dropdown.module.scss';

import { ItemList } from '~/components/ItemList';
import { Popover } from '~/components/popovers/Popover';

type Props = {
  items: {
    title: string,
    to: To
  }[]
};

export function Dropdown({ items, children }: PropsWithChildren<Props>) {
  return (
    <Popover
      content={(ref) => (
        <div className={styles.dropdown}>
          <ItemList direction="vertical">
            {items.map((item, i) => (
              <Link
                key={i}
                to={item.to}
                autoFocus={true}
                className={styles.item}
                onClick={() => ref.current?.hidePopover()}
              >
                {item.title}
              </Link>
            ))}
          </ItemList>
        </div>
      )}
      position="bottom span-left"
      offset=".5rem -.5rem 0 0"
    >
      {children}
    </Popover>
  );
}
