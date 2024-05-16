import { clsx } from 'clsx';
import { useId, useRef } from 'react';
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode  , RefObject } from 'react';

import styles from './Popover.module.scss';

type Props = Omit<ComponentPropsWithoutRef<'button'>, 'content' | 'children'> & {
  content: ReactNode,
  position: string,
  offset?: string,
  children: ReactNode | ((ref: RefObject<HTMLDivElement>, style: CSSProperties) => ReactNode)
};

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T> {
    popover?: 'auto' | 'manual' | undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ButtonHTMLAttributes<T> {
    popovertarget?: string | undefined;
    popovertargetaction?: 'hide' | 'show' | 'toggle' | undefined;
  }

  interface CSSProperties {
    anchorName?: string | undefined;
    positionAnchor?: string | undefined;
    insetArea?: string | undefined;
  }
}

export function Popover({ content, position, offset, className, children, ...props }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replaceAll(':', '');

  const style = { anchorName: `--${id}-anchor` };
  const manual = typeof children === 'function';

  return (
    <>
      {manual ? children(ref, style) : (
        <button
          popovertarget={`${id}-popover`}
          popovertargetaction="toggle"
          style={style}
          className={clsx(styles.anchor, className)}
          {...props}
        >
          {children}
        </button>
      )}
      <div
        ref={ref}
        id={`${id}-popover`}
        popover={manual ? 'manual' : 'auto'}
        style={{
          positionAnchor: `--${id}-anchor`,
          insetArea: position,
          margin: offset
        }}
        className={styles.popover}
      >
        {content}
      </div>
    </>
  );
}
