import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faRotate } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';
import { useNavigation } from 'react-router';

import styles from './Button.module.scss';

type Props = ComponentPropsWithoutRef<'button'> & {
  text: string,
  icon?: IconProp,
  loading?: boolean
};

export function Button({ text, icon, loading, className, ...props }: Props) {
  const { state } = useNavigation();

  const isLoading = loading ?? (props.type === 'submit' && state === 'submitting');
  const disabled = isLoading || props.disabled;

  return (
    <button
      title={text}
      disabled={disabled}
      className={clsx(styles.button, className)}
      {...props}
    >
      <div className={clsx(isLoading && styles.loading)}>
        {icon && (
          <FontAwesomeIcon icon={icon} fixedWidth={true} className={styles.icon}/>
        )}
        {text}
      </div>
      {isLoading && (
        <FontAwesomeIcon icon={faRotate} spin={true} className={styles.spinner}/>
      )}
    </button>
  );
}
