import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clsx } from 'clsx';
import { NavLink, type To } from 'react-router';
import { ItemList } from '~/components/ItemList';
import styles from './Navigation.module.scss';

type Props = {
  items: {
    title: string;
    icon?: IconProp;
    to: To;
    end?: boolean;
  }[];
  orientation: 'horizontal' | 'vertical';
  palette?: string;
};

export function Navigation({ items, orientation, palette }: Props) {
  return (
    <ItemList orientation={orientation} palette={palette}>
      {items.map((item) => (
        <NavLink
          key={item.title}
          to={item.to}
          end={item.end}
          className={({ isActive }) => clsx(isActive && styles.active)}
        >
          {item.icon && <FontAwesomeIcon icon={item.icon} fixedWidth={true} />} {item.title}
        </NavLink>
      ))}
    </ItemList>
  );
}
