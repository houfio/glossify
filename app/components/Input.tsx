import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';
import { useId } from 'react';

import styles from './Input.module.scss';

type Props = ComponentPropsWithoutRef<'input'> & {
  label: string
};

export function Input({ label, className, ...props }: Props) {
  const id = useId();

  return (
    <div className={clsx(styles.wrapper, className)}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input id={id} className={styles.input} {...props}/>
    </div>
  );
}
