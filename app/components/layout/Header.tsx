import type { ReactNode } from 'react';

import styles from './Header.module.scss';

import { Container } from '~/components/layout/Container';

type Props = {
  children: ReactNode;
};

export function Header({ children }: Props) {
  return (
    <header className={styles.header}>
      <Container>
        {children}
      </Container>
    </header>
  );
}
