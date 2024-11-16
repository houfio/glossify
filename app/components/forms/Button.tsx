import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faRotate } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';
import { useNavigation } from 'react-router';
import { withPalette } from '~/utils/styles.ts';
import styles from './Button.module.scss';

type Props = ComponentPropsWithoutRef<'button'> & {
  text: string;
  icon?: IconProp;
  loading?: boolean;
  palette?: string;
  small?: boolean;
};

export function Button({ text, icon, loading, palette = 'accent', small, ...props }: Props) {
  const { state } = useNavigation();

  const isLoading = loading ?? (props.type === 'submit' && state === 'submitting');
  const disabled = isLoading || props.disabled;

  return (
    <button
      title={small ? text : undefined}
      disabled={disabled}
      {...props}
      style={{ ...props.style, ...withPalette(palette) }}
      className={clsx(props.className, styles.button, small && styles.small)}
    >
      <div className={clsx(isLoading && styles.loading)}>
        {icon && <FontAwesomeIcon icon={icon} fixedWidth={!small} className={clsx(!small && styles.icon)} />}
        {!small && text}
      </div>
      {isLoading && <FontAwesomeIcon icon={faRotate} spin={true} className={styles.spinner} />}
    </button>
  );
}
