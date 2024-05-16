import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';

import styles from './Container.module.scss';

export function Container({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={clsx(styles.container, className)} {...props}/>
  );
}
