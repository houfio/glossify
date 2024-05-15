import { faFolders } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Outlet } from '@remix-run/react';
import { unstable_defineLoader } from '@vercel/remix';

import styles from './route.module.scss';

import { getUserId } from '~/session.server';

export const loader = unstable_defineLoader(async ({ request, response }) => {
  const userId = await getUserId(request);

  if (userId) {
    response.status = 302;
    response.headers.set('Location', '/');

    throw response;
  }

  return {};
});

export default function Auth() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.box}>
        <span className={styles.title}>
          <FontAwesomeIcon icon={faFolders}/> Glossify
        </span>
        <Outlet/>
      </div>
    </div>
  );
}
