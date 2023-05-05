import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HTMLProps } from 'react';

import { cs } from '../../utils/cs.ts';

import styles from './Button.module.scss';

type Props = HTMLProps<HTMLButtonElement> & {
  text: string,
  type?: 'button' | 'submit' | 'reset',
  icon?: IconDefinition,
  iconOnly?: boolean | string
};

export function Button({ text, icon, iconOnly = false, ...props }: Props) {
  return (
    <button title={text} className={styles.button} {...props}>
      {icon && (
        <FontAwesomeIcon icon={icon} fixedWidth={true}/>
      )}
      <span
        className={cs({
          [styles.iconOnly]: !!iconOnly,
          [styles[iconOnly as string]]: typeof iconOnly === 'string'
        })}
      >
        {text}
      </span>
    </button>
  );
}
