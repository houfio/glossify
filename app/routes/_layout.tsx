import { Outlet } from 'react-router';
import styles from './_layout.module.scss';
import { Container } from '~/components/layout/Container.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolders } from '@fortawesome/pro-regular-svg-icons';
import { Navigation } from '~/components/Navigation.tsx';

export default function Component() {
  return (
    <>
      <nav className={styles.navigation}>
        <Container asChild={true}>
          <div className={styles.inner}>
            <div className={styles.title}>
              <FontAwesomeIcon icon={faFolders}/> Glossify
            </div>
            <Navigation
              items={[
                {
                  title: 'Words',
                  to: '/',
                  end: true
                }
              ]}
              orientation="horizontal"
            />
          </div>
        </Container>
      </nav>
      <main>
        <Outlet/>
      </main>
      <Container asChild={true}>
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
