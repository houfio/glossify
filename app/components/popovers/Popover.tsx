import { Slot } from '@radix-ui/react-slot';
import type { ReactNode, RefObject } from 'react';
import { useId, useRef } from 'react';

import styles from './Popover.module.scss';

type Node = ReactNode | ((ref: RefObject<HTMLDivElement | null>) => ReactNode);

type Props = {
  content: Node,
  type?: 'auto' | 'manual',
  asChild?: boolean,
  children: Node
};

export function Popover({ content, type = 'auto', asChild, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replaceAll(':', '');

  const Component = asChild ? Slot : 'button';

  return (
    <>
      <Component
        tabIndex={0}
        style={{ anchorName: `--${id}-anchor` }}
        {...type === 'auto' && {
          popoverTarget: `${id}-popover`,
          popoverTargetAction: 'toggle'
        }}
      >
        {typeof children === 'function' ? children(ref) : children}
      </Component>
      <Slot
        ref={ref}
        id={`${id}-popover`}
        popover={type}
        style={{ positionAnchor: `--${id}-anchor` }}
        className={styles.popover}
      >
        {typeof content === 'function' ? content(ref) : content}
      </Slot>
    </>
  );
}
