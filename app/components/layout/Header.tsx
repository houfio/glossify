import type { PropsWithChildren } from 'react';
import { Container } from '~/components/layout/Container';
import styles from './Header.module.scss';

type Props = {
  text: string;
};

export function Header({ text, children }: PropsWithChildren<Props>) {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.container}>
          <span className={styles.title}>{text}</span>
          {children}
        </div>
      </Container>
    </header>
  );
}
