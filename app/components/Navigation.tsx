import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from '@remix-run/react';
import type { To } from '@remix-run/router';
import { clsx } from 'clsx';

import styles from './Navigation.module.scss';

import { ItemList } from '~/components/ItemList';

type Props = {
  items: {
    title: string,
    icon?: IconProp,
    to: To,
    end?: boolean
  }[],
  orientation: 'horizontal' | 'vertical'
};

export function Navigation({ items, orientation }: Props) {
  return (
    <ItemList orientation={orientation} className={clsx(orientation === 'vertical' && styles.vertical)}>
      {items.map((item, i) => (
        <NavLink
          key={i}
          to={item.to}
          end={item.end}
          className={({ isActive }) => clsx(isActive && styles.active)}
        >
          {item.icon && (
            <FontAwesomeIcon icon={item.icon} fixedWidth={true}/>
          )} {item.title}
        </NavLink>
      ))}
    </ItemList>
  );
}
