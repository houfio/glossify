import { Slot } from '@radix-ui/react-slot';
import type { ReactNode, RefObject } from 'react';
import { useId, useRef } from 'react';

import styles from './Popover.module.scss';

type Node = ReactNode | ((ref: RefObject<HTMLDivElement>) => ReactNode);

type Props = {
  content: Node,
  position: string,
  offset?: string,
  type?: 'auto' | 'manual',
  asChild?: boolean,
  children: Node
};

export function Popover({ content, position, offset, type = 'auto', asChild, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replaceAll(':', '');

  const Component = asChild ? Slot : 'button';

  return (
    <>
      <Component
        tabIndex={0}
        style={{ anchorName: `--${id}-anchor` }}
        {...type === 'auto' && {
          popovertarget: `${id}-popover`,
          popovertargetaction: 'toggle'
        }}
      >
        {typeof children === 'function' ? children(ref) : children}
      </Component>
      <div
        ref={ref}
        id={`${id}-popover`}
        popover={type}
        style={{
          positionAnchor: `--${id}-anchor`,
          insetArea: position,
          margin: offset
        }}
        className={styles.popover}
      >
        {typeof content === 'function' ? content(ref) : content}
      </div>
    </>
  );
}
