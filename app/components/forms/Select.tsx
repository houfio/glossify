import { faChevronDown } from '@fortawesome/pro-regular-svg-icons';
import type { ReactNode } from 'react';
import { mergeProps } from 'react-aria';
import {
  Label as AriaLabel,
  Select as AriaSelect,
  type SelectProps,
  SelectValue as AriaSelectValue
} from 'react-aria-components';
import { ListBox } from '~/components/ListBox.tsx';
import { Button } from '~/components/forms/Button.tsx';
import { Popover } from '~/components/popovers/Popover.tsx';
import styles from './Select.module.scss';

type Props<T extends object> = Omit<SelectProps<T>, 'children'> & {
  label?: string;
  items: T[];
  render: (item: T) => ReactNode;
  size?: 'small' | 'medium' | 'big';
  shape?: 'square' | 'round';
  variant?: 'outlined' | 'flat';
  palette?: string;
};

export function Select<T extends object>({ label, items, render, size, shape, variant, palette, ...props }: Props<T>) {
  return (
    <AriaSelect {...mergeProps(props, { className: styles.select })}>
      {label && <AriaLabel>{label}</AriaLabel>}
      <Button text={<AriaSelectValue />} icon={faChevronDown} flipOrder={true} size={size} shape={shape} variant={variant} palette={palette} />
      <Popover palette={palette}>
        <ListBox items={items} render={render} />
      </Popover>
    </AriaSelect>
  );
}
