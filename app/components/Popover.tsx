import type { PropsWithChildren, ReactNode } from 'react';
import { useId } from 'react';

import styles from './Popover.module.scss';

type Props = {
  content: ReactNode
};

export function Popover({ content, children }: PropsWithChildren<Props>) {
  const id = useId().replaceAll(':', '');

  return (
    <>
      <button
        popovertarget={`${id}-popover`}
        popovertargetaction="toggle"
        style={{
          anchorName: `--${id}-anchor`
        }}
        className={styles.anchor}
      >
        {children}
      </button>
      <div
        id={`${id}-popover`}
        popover="auto"
        style={{
          positionAnchor: `--${id}-anchor`
        }}
        className={styles.popover}
      >
        {content}
      </div>
    </>
  );
}
