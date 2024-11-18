import type { ReactNode } from 'react';
import { ListBox as AriaListBox, ListBoxItem as AriaListBoxItem, type ListBoxProps } from 'react-aria-components';
import styles from './ListBox.module.scss';
import { mergeProps } from '@react-aria/utils';

type Props<T> = Omit<ListBoxProps<T>, 'children'> & {
  render: (item: T) => ReactNode;
};

export function ListBox<T extends object>({ render, ...props }: Props<T>) {
  return (
    <AriaListBox {...mergeProps(props, { className: styles.list })}>
      {(item) => <AriaListBoxItem className={styles.item}>{render(item)}</AriaListBoxItem>}
    </AriaListBox>
  );
}
