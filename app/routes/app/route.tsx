import { faBolt, faFolders, faGraduationCap, faUser } from '@fortawesome/pro-regular-svg-icons';
import {
  faBolt as faBoltActive,
  faFolders as faFoldersActive,
  faGraduationCap as faGraduationCapActive,
  faUser as faUserActive
} from '@fortawesome/pro-solid-svg-icons';
import { Outlet } from '@remix-run/react';
import type { LoaderArgs } from '@vercel/remix';
import { json } from '@vercel/remix';

import { Navigation } from './Navigation';
import styles from './route.module.css';

import { requireUser } from '~/session.server';

export const loader = async ({ request }: LoaderArgs) => {
  return json({
    user: await requireUser(request),
    specialName: process.env.SPECIAL_NAME
  });
};

export default function App() {
  return (
    <div className={styles.app}>
      <div className={styles.content}>
        <Outlet/>
      </div>
      <Navigation
        items={[{
          label: 'Words',
          icon: [faFolders, faFoldersActive],
          to: '/app/words'
        }, {
          label: 'Practise',
          icon: [faGraduationCap, faGraduationCapActive],
          to: '/app/practise'
        }, {
          label: 'Challenge',
          icon: [faBolt, faBoltActive],
          to: '/app/challenges'
        }, {
          label: 'Profile',
          icon: [faUser, faUserActive],
          to: '/app/profile'
        }]}
      />
    </div>
  );
}
