import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faRotate } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { mergeProps } from '@react-aria/utils';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { Button as AriaButton, type ButtonProps } from 'react-aria-components';
import { useNavigation } from 'react-router';
import { withPalette } from '~/utils/styles.ts';
import styles from './Button.module.scss';

type Props = Omit<ButtonProps, 'children'> & {
  text: ReactNode;
  icon?: IconProp;
  showText?: string | boolean;
  flipOrder?: boolean;
  size?: 'small' | 'medium' | 'big';
  shape?: 'square' | 'round';
  variant?: 'outlined' | 'flat';
  palette?: string;
};

export function Button({
  text,
  icon,
  showText = 'phone',
  flipOrder,
  size = 'medium',
  shape = 'square',
  variant = 'outlined',
  palette = 'accent',
  ...props
}: Props) {
  const { state } = useNavigation();

  return (
    <AriaButton
      {...mergeProps(props, {
        isPending: props.isPending ?? (props.type === 'submit' && state === 'submitting'),
        className: clsx(
          styles.button,
          showText && styles[`text-${showText}`],
          styles[`size-${size}`],
          styles[`shape-${shape}`],
          styles[`variant-${variant}`]
        ),
        style: withPalette(palette)
      })}
    >
      {({ isPending }) => (
        <>
          <div className={clsx(styles.inner, isPending && styles.pending)}>
            {icon && <FontAwesomeIcon icon={icon} className={clsx(styles.icon, flipOrder && styles.flip)} />}
            <span className={styles.text}>{text}</span>
          </div>
          {isPending && (
            <FontAwesomeIcon
              icon={faRotate}
              spin={true}
              aria-hidden={false}
              aria-label="Pending..."
              className={styles.spinner}
            />
          )}
        </>
      )}
    </AriaButton>
  );
}
