import { mergeProps } from '@react-aria/utils';
import {
  Input as AriaInput,
  Label as AriaLabel,
  TextField as AriaTextField,
  type TextFieldProps
} from 'react-aria-components';
import styles from './Input.module.scss';

type Props = Omit<TextFieldProps, 'children'> & {
  label?: string;
};

export function Input({ label, ...props }: Props) {
  return (
    <AriaTextField {...mergeProps(props, { className: styles.wrapper })}>
      {label && <AriaLabel>{label}</AriaLabel>}
      <AriaInput className={styles.input} />
    </AriaTextField>
  );
}
