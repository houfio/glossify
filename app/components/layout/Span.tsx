import { clsx } from 'clsx';
import type { PropsWithChildren } from 'react';
import { mapStyles } from '~/utils/styles.ts';
import styles from './Span.module.scss';

type Props = {
  span?: Record<string, number>;
};

export function Span({ span = {}, children }: PropsWithChildren<Props>) {
  return <div className={clsx(mapStyles(styles, span, 'spans-$key-$value'))}>{children}</div>;
}
