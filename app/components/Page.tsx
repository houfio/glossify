import type { ComponentProps, ReactNode } from 'react';

import styles from './Page.module.css';

import { Button } from '~/components/forms/Button';

type Props = {
  actions?: ComponentProps<typeof Button>[]
  children: ReactNode
};

export function Page({ actions = [], children }: Props) {
  return (
    <>
      <header className={styles.header}>
        {actions.map((action, i) => (
          <Button key={i} {...action}/>
        ))}
      </header>
      <main className={styles.main}>
        {children}
      </main>
    </>
  );
}
