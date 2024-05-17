import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';
import { useId } from 'react';

import styles from './Input.module.scss';

import { useForm } from '~/hooks/useForm';

type Props = ComponentPropsWithoutRef<'input'> & {
  label: string
};

export function Input({ label, className, ...props }: Props) {
  const id = useId();
  const { issues } = useForm();

  const issue = issues.filter((issue) => issue.field === props.name)[0];

  return (
    <div className={clsx(styles.wrapper, className)}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input id={id} className={clsx(styles.input, issue && styles.issue)} {...props}/>
      {issue && (
        <div className={styles.messageWrapper}>
          <div className={styles.message}>
            {issue.message}
          </div>
        </div>
      )}
    </div>
  );
}
