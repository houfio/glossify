import { faExplosion } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './Error.module.scss';

export function Error() {
  return (
    <div className={styles.error}>
      <FontAwesomeIcon icon={faExplosion} size="xl"/>
      Whoops, something went wrong
    </div>
  );
}
