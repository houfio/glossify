import { HTMLProps } from 'react';
import { useFormContext } from 'react-hook-form';

import styles from './Input.module.scss';

type Props = HTMLProps<HTMLInputElement> & {
  name: string,
  label: string
};

export function Input({ name, label, ...props }: Props) {
  const { register } = useFormContext();

  return (
    <label htmlFor={name} className={styles.wrapper}>
      <input id={name} className={styles.input} placeholder=" " {...props} {...register(name)}/>
      <span className={styles.label}>
        {label}
      </span>
    </label>
  );
}
