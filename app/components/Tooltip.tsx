import { Slot } from '@radix-ui/react-slot';
import type { PropsWithChildren, ReactNode } from 'react';

import styles from './Tooltip.module.scss';

import { Popover } from '~/components/Popover';

type Props = {
  content: ReactNode,
  asChild?: boolean
};

export function Tooltip({ content, asChild, children }: PropsWithChildren<Props>) {
  const Component = asChild ? Slot : 'span';

  return (
    <Popover
      content={(
        <div className={styles.tooltip}>
          {content}
        </div>
      )}
      position="top span-all"
      offset="0 0 .25rem 0"
    >
      {(ref, style) => (
        <Component
          style={style}
          tabIndex={0}
          onMouseEnter={() => ref.current?.showPopover()}
          onMouseLeave={() => ref.current?.hidePopover()}
          onFocus={() => ref.current?.showPopover()}
          onBlur={() => ref.current?.hidePopover()}
        >
          {children}
        </Component>
      )}
    </Popover>
  );
}
