import type { HTMLProps } from 'react';

import styles from './Checkbox.module.css';

type Props = {
  name: string,
  label: string
};

export function Checkbox({ name, label, ...props }: Props & HTMLProps<HTMLInputElement>) {
  return (
    <label htmlFor={name} className={styles.wrapper}>
      <input id={name} name={name} type="checkbox" className={styles.checkbox} {...props}/>
      <span className={styles.label}>
        {label}
      </span>
    </label>
  );
}
