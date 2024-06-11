import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faRotate } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';
import { useNavigation } from 'react-router';

import styles from './Button.module.scss';

import { Tooltip } from '~/components/popovers/Tooltip';
import { withPalette } from '~/utils/withPalette';

type Props = ComponentPropsWithoutRef<'button'> & {
  text: string,
  icon?: IconProp,
  loading?: boolean,
  palette?: string,
  small?: boolean
};

export function Button({ text, icon, loading, palette = 'accent', small, ...props }: Props) {
  const { state } = useNavigation();

  const isLoading = loading ?? (props.type === 'submit' && state === 'submitting');
  const disabled = isLoading || props.disabled;
  const button = (
    <button
      disabled={disabled}
      style={withPalette(palette)}
      className={clsx(styles.button, small && styles.small)}
      {...props}
    >
      <div className={clsx(isLoading && styles.loading)}>
        {icon && (
          <FontAwesomeIcon
            icon={icon}
            fixedWidth={!small}
            className={clsx(!small && styles.icon)}
          />
        )}
        {!small && text}
      </div>
      {isLoading && (
        <FontAwesomeIcon icon={faRotate} spin={true} className={styles.spinner}/>
      )}
    </button>
  );

  if (!small) {
    return button;
  }

  return (
    <Tooltip content={text} asChild={true}>
      {button}
    </Tooltip>
  );
}
