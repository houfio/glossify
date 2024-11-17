import { Outlet } from 'react-router';
import { Container } from '~/components/layout/Container.tsx';
import styles from './_layout.module.scss';

export default function Component() {
  return (
    <>
      <main className={styles.main}>
        <Outlet />
      </main>
      <Container>
        <footer className={styles.footer}>
          <span>Glossify</span>
          <a
            href={`https://github.com/houfio/glossify/commit/${__VERSION__}`}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            {__VERSION__}
          </a>
        </footer>
      </Container>
    </>
  );
}
