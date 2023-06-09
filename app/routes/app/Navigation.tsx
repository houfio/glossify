import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink, useNavigation } from '@remix-run/react';

import styles from './Navigation.module.css';

import { Spinner } from '~/components/Spinner';
import { cs } from '~/utils/cs';

type Props = {
  items: {
    label: string,
    icon: [IconDefinition, IconDefinition],
    to: string
  }[]
};

export function Navigation({ items }: Props) {
  const navigation = useNavigation();

  return (
    <nav className={styles.navigation}>
      <span
        className={cs(styles.top, {
          [styles.loading]: navigation.state === 'loading'
        })}
      >
        <span className={styles.logo}>
          Gfy
        </span>
        <div className={styles.spinner}>
          <Spinner/>
        </div>
      </span>
      {items.map((item, i) => (
        <NavLink
          key={i}
          to={item.to}
          className={({ isActive }) => cs(styles.item, {
            [styles.active]: isActive
          })}
        >
          {({ isActive }) => (
            <>
              <div className={styles.wrapper}>
                <div className={cs(styles.state)}/>
                <FontAwesomeIcon icon={item.icon[isActive ? 1 : 0]} className={styles.icon}/>
              </div>
              <span className={styles.label}>
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
