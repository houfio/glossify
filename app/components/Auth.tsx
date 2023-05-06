import { Form } from '@remix-run/react';
import type { ReactNode } from 'react';

import styles from './Auth.module.css';

type Props = {
  inputs: ReactNode,
  actions: ReactNode,
  children?: ReactNode
};

export function Auth({ inputs, actions, children }: Props) {
  return (
    <div className={styles.login}>
      <div className={styles.container}>
        <span className={styles.logo}>
          Glossify
        </span>
        <Form method="post">
          {inputs}
          <div className={styles.actions}>
            {actions}
          </div>
        </Form>
      </div>
      {children}
    </div>
  );
}
