import type { HTMLProps } from 'react';

import styles from './Input.module.css';

import { cs } from '~/utils/cs';

type Props = {
  name: string,
  label: string,
  errors?: { field?: string, message: string }[]
};

export function Input({ name, label, errors, ...props }: Props & HTMLProps<HTMLInputElement>) {
  const error = errors?.find((e) => e.field === name);

  return (
    <label htmlFor={name} className={styles.wrapper}>
      <input
        id={name}
        name={name}
        className={cs(styles.input, {
          [styles.error]: Boolean(error)
        })}
        placeholder=" "
        {...props}
      />
      <span className={styles.label}>
        {label}
      </span>
      {error && (
        <div className={styles.errorWrapper}>
          {error?.message}
        </div>
      )}
    </label>
  );
}
