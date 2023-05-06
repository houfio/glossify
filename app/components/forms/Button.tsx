import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { HTMLProps } from 'react';

import styles from './Button.module.css';

import { Spinner } from '~/components/Spinner';
import { cs } from '~/utils/cs';

type Props = {
  text: string,
  icon?: IconDefinition,
  iconOnly?: boolean | string,
  loading?: boolean,
  type?: 'button' | 'submit' | 'reset'
};

export function Button({ text, icon, iconOnly, loading, disabled, ...props }: Props & HTMLProps<HTMLButtonElement>) {
  return (
    <button
      title={text}
      className={cs(styles.button, {
        [styles.loading]: loading
      })}
      disabled={disabled || loading}
      {...props}
    >
      {icon && (
        <FontAwesomeIcon icon={icon} className={styles.content} fixedWidth={true}/>
      )}
      <span
        className={cs(styles.content, {
          [styles.iconOnly]: Boolean(iconOnly),
          [styles[iconOnly as string]]: typeof iconOnly === 'string'
        })}
      >
        {text}
      </span>
      <div className={styles.spinner}>
        <Spinner/>
      </div>
    </button>
  );
}
