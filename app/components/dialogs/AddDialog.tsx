import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faAdd } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, useNavigation } from '@remix-run/react';
import type { DialoogProps } from 'dialoog';
import type { ReactNode } from 'react';

import styles from './AddDialog.module.css';

import { Dialog } from '~/components/dialogs/Dialoog';
import { Button } from '~/components/forms/Button';

type Props = DialoogProps & {
  title: string,
  subtitle: string,
  icon: IconDefinition,
  children: ReactNode
};

export function AddDialog({ title, subtitle, icon, children, ...props }: Props) {
  const navigation = useNavigation();

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
        <Form action={`${window.location.pathname}?/create`} method="post">
          {children}
          <div className={styles.actions}>
            <Button text="Add" icon={faAdd} loading={navigation.state === 'submitting'}/>
          </div>
        </Form>
      </div>
    </Dialog>
  );
}
