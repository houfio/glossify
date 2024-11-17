import { type AriaToastRegionProps, useToastRegion } from '@react-aria/toast';
import { useToastQueue } from '@react-stately/toast';
import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { Toast } from '~/components/popovers/Toast.tsx';
import { toasts } from '~/utils/toast.ts';
import styles from './ToastRegion.module.scss';

type Props = AriaToastRegionProps;

export function ToastRegion(props: Props) {
  const state = useToastQueue(toasts);
  const ref = useRef<HTMLDivElement>(null);
  const { regionProps } = useToastRegion(props, state, ref);

  if (!state.visibleToasts.length) {
    return null;
  }

  return createPortal(
    <div {...regionProps} ref={ref} className={styles.region}>
      {state.visibleToasts.map((toast) => (
        <Toast key={toast.key} toast={toast} state={state} />
      ))}
    </div>,
    document.body
  );
}
