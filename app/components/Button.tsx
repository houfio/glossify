import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';

import styles from './Button.module.css';

type Props = ComponentPropsWithoutRef<'button'> & {
  icon?: IconProp
};

export function Button({ icon, className, children, ...props }: Props) {
  return (
    <button className={clsx(styles.button, className)} {...props}>
      {icon && (
        <FontAwesomeIcon icon={icon} fixedWidth={true} className={styles.icon}/>
      )}
      {children}
    </button>
  );
}
