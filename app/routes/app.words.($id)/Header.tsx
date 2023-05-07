import styles from './Header.module.css';

import { useMatchesData } from '~/hooks/useMatchesData';
import { useUser } from '~/hooks/useUser';


export function Header() {
  const user = useUser();
  const data = useMatchesData('routes/app');

  return (
    <div className={styles.header}>
      Welcome back, {user.username}
      {user.username === data?.specialName && (
        <span className={styles.emoji}>❤️</span>
      )}
    </div>
  );
}
