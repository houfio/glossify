import { faBolt, faFolders, faGraduationCap, faUser } from '@fortawesome/pro-regular-svg-icons';
import {
  faBolt as faBoltActive,
  faFolders as faFoldersActive,
  faGraduationCap as faGraduationCapActive,
  faUser as faUserActive
} from '@fortawesome/pro-solid-svg-icons';
import { Navigate, Outlet } from 'react-router-dom';

import { Navigation } from '../components/Navigation.tsx';
import { useAuthentication } from '../states/authentication.ts';

import styles from './Root.module.scss';

export function Root() {
  const [{ token }] = useAuthentication();

  if (!token) {
    return (
      <Navigate to="/login" replace={true}/>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <Outlet/>
      </div>
      <Navigation
        items={[{
          label: 'Words',
          icon: [faFolders, faFoldersActive],
          to: '/folders'
        }, {
          label: 'Practise',
          icon: [faGraduationCap, faGraduationCapActive],
          to: '/practise'
        }, {
          label: 'Challenge',
          icon: [faBolt, faBoltActive],
          to: '/challenges'
        }, {
          label: 'Profile',
          icon: [faUser, faUserActive],
          to: '/profile'
        }]}
      />
    </div>
  );
}
