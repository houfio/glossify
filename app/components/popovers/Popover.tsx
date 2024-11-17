import { mergeProps } from '@react-aria/utils';
import { Popover as AriaPopover, type PopoverProps } from 'react-aria-components';
import { withPalette } from '~/utils/styles.ts';
import styles from './Popover.module.scss';

type Props = PopoverProps & {
  palette?: string;
};

export function Popover({ palette = 'surface', ...props }: Props) {
  return <AriaPopover {...mergeProps(props, { className: styles.popover, style: withPalette(palette) })} />;
}
