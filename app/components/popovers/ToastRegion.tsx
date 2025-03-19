import {
  Text as AriaText,
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as AriaToastContent,
  UNSTABLE_ToastRegion as AriaToastRegion
} from 'react-aria-components';
import { toasts } from '~/utils/toast.ts';
import { Button } from '~/components/forms/Button.tsx';
import { faXmark } from '@fortawesome/pro-regular-svg-icons';
import { withPalette } from '~/utils/styles.ts';
import styles from './ToastRegion.module.scss';

export function ToastRegion() {
  return (
    <AriaToastRegion queue={toasts} className={styles.region}>
      {({ toast }) => (
        <AriaToast toast={toast} className={styles.toast} style={withPalette(toast.content.palette)}>
          <AriaToastContent>
            <AriaText slot="title">{toast.content.message}</AriaText>
          </AriaToastContent>
          <Button
            slot="close"
            text="Dismiss"
            icon={faXmark}
            showText={false}
            size="small"
            variant="flat"
            palette={toast.content.palette}
          />
        </AriaToast>
      )}
    </AriaToastRegion>
  );
}
