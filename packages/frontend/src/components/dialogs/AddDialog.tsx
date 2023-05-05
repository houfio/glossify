import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DialoogProps } from 'dialoog';
import { ReactNode } from 'react';

import styles from './AddDialog.module.scss';
import { Dialog } from './Dialog.tsx';

type Props = DialoogProps & {
  title: string,
  subtitle: string,
  icon: IconDefinition,
  children: ReactNode
};

export function AddDialog({ title, subtitle, icon, children, ...props }: Props) {
  return (
    <Dialog {...props}>
      <div className={styles.dialog}>
        <FontAwesomeIcon icon={icon} size="xl" className={styles.icon}/>
        <span className={styles.title}>
          {title}
        </span>
        <span className={styles.subtitle}>
          {subtitle}
        </span>
        {children}
      </div>
    </Dialog>
  );
}
