import type { PropsWithChildren } from 'react';

import styles from './Header.module.scss';

import { Container } from '~/components/layout/Container';

type Props = {
  text: string;
};

export function Header({ text, children }: PropsWithChildren<Props>) {
  return (
    <header className={styles.header}>
      <Container asChild={true}>
        <div className={styles.container}>
          <span className={styles.title}>{text}</span>
          {children}
        </div>
      </Container>
    </header>
  );
}
