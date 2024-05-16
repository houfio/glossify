import { Slot } from '@radix-ui/react-slot';
import type { PropsWithChildren, ReactNode, RefObject } from 'react';
import { useState } from 'react';

import styles from './Tooltip.module.scss';

import { Popover } from '~/components/popovers/Popover';

type Props = {
  content: ReactNode,
  asChild?: boolean
};

export function Tooltip({ content, asChild, children }: PropsWithChildren<Props>) {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);

  const Component = asChild ? Slot : 'span';

  const updatePopover = (ref: RefObject<HTMLDivElement>, hover: boolean, focus: boolean) => {
    setHover(hover);
    setFocus(focus);

    if (hover || focus) {
      ref.current?.showPopover();
    } else {
      ref.current?.hidePopover();
    }
  };

  return (
    <Popover
      content={(
        <div className={styles.tooltip}>
          {content}
        </div>
      )}
      position="top"
      offset="0 0 .25rem 0"
      type="manual"
      asChild={true}
    >
      {(ref) => (
        <Component
          onMouseEnter={() => updatePopover(ref, true, focus)}
          onMouseLeave={() => updatePopover(ref, false, focus)}
          onFocus={() => updatePopover(ref, hover, true)}
          onBlur={() => updatePopover(ref, hover, false)}
        >
          {children}
        </Component>
      )}
    </Popover>
  );
}
