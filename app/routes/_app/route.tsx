import { faFolders } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Outlet, useLoaderData } from '@remix-run/react';
import { unstable_defineLoader } from '@vercel/remix';

import styles from './route.module.scss';

import { Container } from '~/components/Container';
import { Dropdown } from '~/components/popovers/Dropdown';
import { requireUser } from '~/session.server';

export const loader = unstable_defineLoader(async ({ request, response }) => {
  const user = await requireUser(request, response);

  return { user };
});

export default function App() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <>
      <div className={styles.header}>
        <Container className={styles.inner}>
          <div>
            <FontAwesomeIcon icon={faFolders}/> Glossify
          </div>
          <Dropdown items={[user.id, user.username, user.email]}>
            <div className={styles.avatar}/>
          </Dropdown>
        </Container>
      </div>
      <Outlet/>
    </>
  );
}
