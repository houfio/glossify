import { Slot } from '@radix-ui/react-slot';
import type { PropsWithChildren } from 'react';

import styles from './Container.module.scss';

type Props = {
  asChild?: boolean
};

export function Container({ asChild, children }: PropsWithChildren<Props>) {
  const Component = asChild ? Slot : 'div';

  return (
    <Component className={styles.container}>
      {children}
    </Component>
  );
}
