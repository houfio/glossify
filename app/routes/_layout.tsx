import { NavLink, Outlet } from 'react-router';
import { Container } from '~/components/layout/Container.tsx';
import { userMiddleware } from '~/middleware/user.ts';
import type { Route } from './+types/_layout.ts';
import styles from './_layout.module.scss';

export const unstable_middleware: Route.unstable_MiddlewareFunction[] = [userMiddleware];

export default function Component() {
  return (
    <>
      <NavLink to="/">Words</NavLink>
      <NavLink to="/practises">Practises</NavLink>
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
