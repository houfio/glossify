import { Form as RemixForm } from '@remix-run/react';
import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';

import styles from './Form.module.scss';

import { useForm } from '~/hooks/useForm';
import type { Issue } from '~/types';

type Props = ComponentPropsWithoutRef<typeof RemixForm> & {
  issues?: Issue[];
};

export function Form({ issues = [], className, ...props }: Props) {
  return (
    <useForm.Provider issues={issues}>
      <RemixForm className={clsx(styles.form, className)} {...props} />
    </useForm.Provider>
  );
}
