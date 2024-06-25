import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Slot } from '@radix-ui/react-slot';
import { Link } from '@remix-run/react';
import type { To } from '@remix-run/router';
import type { PropsWithChildren } from 'react';
import { useRef } from 'react';

import styles from './Dropdown.module.scss';

import { ItemList } from '~/components/ItemList';
import { Popover } from '~/components/popovers/Popover';
import type { ImperativePopoverHandle } from '~/types';
import { withPalette } from '~/utils/withPalette';

type Props = {
  items: {
    title: string;
    icon: IconProp;
    to?: To;
    onClick?: () => void;
  }[];
  palette?: string;
  asChild?: boolean;
};

export function Dropdown({ items, palette = 'surface', asChild, children }: PropsWithChildren<Props>) {
  const ref = useRef<ImperativePopoverHandle>(null);

  return (
    <Popover
      ref={ref}
      content={
        <div style={withPalette(palette)} className={styles.dropdown}>
          <ItemList orientation="vertical" palette={palette}>
            {items.map((item) => (
              <Slot
                key={item.title}
                autoFocus={true}
                onClick={() => {
                  item.onClick?.();
                  ref.current?.hide();
                }}
              >
                {item.to ? (
                  <Link to={item.to}>
                    <FontAwesomeIcon icon={item.icon} fixedWidth={true} /> {item.title}
                  </Link>
                ) : (
                  <button type="button">
                    <FontAwesomeIcon icon={item.icon} fixedWidth={true} /> {item.title}
                  </button>
                )}
              </Slot>
            ))}
          </ItemList>
        </div>
      }
      asChild={asChild}
    >
      {children}
    </Popover>
  );
}
