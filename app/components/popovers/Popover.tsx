import { Slot } from '@radix-ui/react-slot';
import type { PropsWithChildren, ReactNode, RefObject } from 'react';
import { useEffect, useId, useImperativeHandle, useRef } from 'react';
import styles from './Popover.module.scss';

type Props = {
  ref?: RefObject<ImperativePopoverHandle | null>;
  open?: boolean;
  content: ReactNode;
  asChild?: boolean;
};

export type ImperativePopoverHandle = {
  show: () => void;
  hide: () => void;
};

export function Popover({ ref, open, content, asChild, children }: PropsWithChildren<Props>) {
  const popoverRef = useRef<HTMLElement>(null);
  const id = useId().replaceAll(':', '');

  useImperativeHandle(
    ref,
    () => ({
      show: () => popoverRef.current?.showPopover(),
      hide: () => popoverRef.current?.hidePopover()
    }),
    []
  );

  useEffect(() => {
    if (open === undefined) {
      return;
    }

    if (open) {
      popoverRef.current?.showPopover();
    } else {
      popoverRef.current?.hidePopover();
    }
  }, [open]);

  const Component = asChild ? Slot : 'button';
  const auto = open === undefined;

  return (
    <>
      <Component
        tabIndex={0}
        style={{ anchorName: `--${id}-anchor` }}
        {...(auto && {
          popoverTarget: `${id}-popover`,
          popoverTargetAction: 'toggle'
        })}
      >
        {children}
      </Component>
      <Slot
        ref={popoverRef}
        id={`${id}-popover`}
        popover={auto ? 'auto' : 'manual'}
        style={{ positionAnchor: `--${id}-anchor` }}
        className={styles.popover}
      >
        {content}
      </Slot>
    </>
  );
}
