import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';
import { useId } from 'react';

import styles from './Select.module.scss';

type Props<T> = Omit<ComponentPropsWithoutRef<'select'>, 'children'> & {
  label: string,
  options: {
    value: T,
    label: string
  }[],
  small?: boolean,
  setValue?: (value: T) => void
};

export function Select<T extends string>({
  label,
  options,
  small = false,
  setValue,
  ...props
}: Props<T>) {
  const id = useId();

  return (
    <div className={clsx(styles.wrapper, props.className)}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <select
        {...props}
        id={id}
        className={styles.select}
        onChange={(e) => {
          setValue?.(e.target.value as T);
          props.onChange?.(e);
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
