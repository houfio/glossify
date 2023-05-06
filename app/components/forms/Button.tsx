import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { HTMLProps } from 'react';

import styles from './Button.module.css';

import { cs } from '~/utils/cs';

type Props = {
  text: string,
  icon?: IconDefinition,
  iconOnly?: boolean | string,
  type?: 'button' | 'submit' | 'reset'
};

export function Button({ text, icon, iconOnly, ...props }: Props & HTMLProps<HTMLButtonElement>) {
  return (
    <button title={text} className={styles.button} {...props}>
      {icon && (
        <FontAwesomeIcon icon={icon} fixedWidth={true}/>
      )}
      <span
        className={cs({
          [styles.iconOnly]: Boolean(iconOnly),
          [styles[iconOnly as string]]: typeof iconOnly === 'string'
        })}
      >
        {text}
      </span>
    </button>
  );
}
