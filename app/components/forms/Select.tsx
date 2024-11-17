import { faChevronDown } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactNode } from 'react';
import { mergeProps } from 'react-aria';
import {
  Button as AriaButton,
  ComboBox as AriaComboBox,
  type ComboBoxProps,
  Input as AriaInput,
  Label as AriaLabel,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem
} from 'react-aria-components';
import { Popover } from '~/components/popovers/Popover.tsx';
import styles from './Select.module.scss';

type Props<T extends object> = Omit<ComboBoxProps<T>, 'children'> & {
  label?: string;
  render: (item: T) => ReactNode;
  palette?: string;
};

export function Select<T extends object>({ label, items, render, palette, ...props }: Props<T>) {
  return (
    <AriaComboBox {...mergeProps(props, { className: styles.select })}>
      {label && <AriaLabel>{label}</AriaLabel>}
      <div>
        <AriaInput className={styles.input} />
        <AriaButton className={styles.button}>
          <FontAwesomeIcon icon={faChevronDown} />
        </AriaButton>
      </div>
      <Popover palette={palette}>
        <AriaListBox items={items}>
          {(item) => <AriaListBoxItem className={styles.item}>{render(item)}</AriaListBoxItem>}
        </AriaListBox>
      </Popover>
    </AriaComboBox>
  );
}
