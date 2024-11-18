import { faChevronDown } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactNode } from 'react';
import { mergeProps } from 'react-aria';
import {
  Button as AriaButton,
  ComboBox as AriaComboBox,
  Input as AriaInput,
  Label as AriaLabel,
  type ComboBoxProps
} from 'react-aria-components';
import { ListBox } from '~/components/ListBox.tsx';
import { Popover } from '~/components/popovers/Popover.tsx';
import styles from './Combobox.module.scss';

type Props<T extends object> = Omit<ComboBoxProps<T>, 'children'> & {
  label?: string;
  render: (item: T) => ReactNode;
  palette?: string;
};

export function Combobox<T extends object>({ label, items, render, palette, ...props }: Props<T>) {
  return (
    <AriaComboBox {...mergeProps(props, { className: styles.combobox })}>
      {label && <AriaLabel>{label}</AriaLabel>}
      <div>
        <AriaInput className={styles.input} />
        <AriaButton className={styles.button}>
          <FontAwesomeIcon icon={faChevronDown} />
        </AriaButton>
      </div>
      <Popover palette={palette}>
        <ListBox items={items} render={render} />
      </Popover>
    </AriaComboBox>
  );
}
