import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Slot } from '@radix-ui/react-slot';
import { Link } from '@remix-run/react';
import type { To } from '@remix-run/router';
import type { PropsWithChildren } from 'react';

import styles from './Dropdown.module.scss';

import { ItemList } from '~/components/ItemList';
import { Popover } from '~/components/popovers/Popover';

type Props = {
  items: {
    title: string,
    icon: IconProp,
    to?: To,
    onClick?: () => void
  }[]
};

export function Dropdown({ items, children }: PropsWithChildren<Props>) {
  return (
    <Popover
      content={(ref) => (
        <div className={styles.dropdown}>
          <ItemList orientation="vertical">
            {items.map((item, i) => (
              <Slot
                key={i}
                autoFocus={true}
                onClick={() => {
                  item.onClick?.();
                  ref.current?.hidePopover();
                }}
              >
                {item.to ? (
                  <Link to={item.to}>
                    <FontAwesomeIcon icon={item.icon} fixedWidth={true}/> {item.title}
                  </Link>
                ) : (
                  <button>
                    <FontAwesomeIcon icon={item.icon} fixedWidth={true}/> {item.title}
                  </button>
                )}
              </Slot>
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
