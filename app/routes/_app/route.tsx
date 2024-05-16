import { faCircleUser, faFolders } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, Outlet } from '@remix-run/react';
import { unstable_defineLoader } from '@vercel/remix';

import styles from './route.module.scss';

import { Container } from '~/components/Container';
import { ItemList } from '~/components/ItemList';
import { Dropdown } from '~/components/popovers/Dropdown';
import { requireUser } from '~/session.server';

export const loader = unstable_defineLoader(async ({ request, response }) => {
  const user = await requireUser(request, response);

  return { user };
});

export default function App() {
  return (
    <>
      <nav className={styles.navigation}>
        <Container className={styles.inner}>
          <div className={styles.title}>
            <FontAwesomeIcon icon={faFolders}/> Glossify
          </div>
          <ItemList direction="horizontal">
            <Link to="/">
              Words
            </Link>
            <Link to="/practise">
              Practise
            </Link>
          </ItemList>
          <Dropdown
            items={[{
              title: 'Settings',
              to: '/settings'
            }, {
              title: 'Log out',
              to: '/logout'
            }]}
          >
            <FontAwesomeIcon icon={faCircleUser} className={styles.avatar}/>
          </Dropdown>
        </Container>
      </nav>
      <Outlet/>
    </>
  );
}
