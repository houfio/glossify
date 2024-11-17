import { faXmark } from '@fortawesome/pro-regular-svg-icons';
import { type AriaToastProps, useToast } from '@react-aria/toast';
import type { ToastState } from '@react-stately/toast';
import { useRef } from 'react';
import { Button } from '~/components/forms/Button.tsx';
import { withPalette } from '~/utils/styles.ts';
import type { ToastData } from '~/utils/toast.ts';
import styles from './Toast.module.scss';

type Props = AriaToastProps<ToastData> & {
  state: ToastState<ToastData>;
};

export function Toast({ state, ...props }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { toastProps, contentProps, titleProps, closeButtonProps } = useToast(props, state, ref);

  return (
    <div
      {...toastProps}
      ref={ref}
      className={styles.toast}
      data-animation={props.toast.animation}
      style={withPalette(props.toast.content.palette)}
    >
      <div {...contentProps}>
        <div {...titleProps}>{props.toast.content.message}</div>
      </div>
      <Button
        {...closeButtonProps}
        text="Dismiss"
        icon={faXmark}
        showText={false}
        size="small"
        variant="flat"
        palette={props.toast.content.palette}
      />
    </div>
  );
}
