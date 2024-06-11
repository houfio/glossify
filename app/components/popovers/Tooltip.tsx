import { Slot } from '@radix-ui/react-slot';
import type { PropsWithChildren, ReactNode } from 'react';
import { useId, useState } from 'react';

import styles from './Tooltip.module.scss';

import { Popover } from '~/components/popovers/Popover';
import { withPalette } from '~/utils/withPalette';

type Props = {
  content: ReactNode,
  palette?: string,
  asChild?: boolean
};

export function Tooltip({ content, palette = 'surface-variant', asChild, children }: PropsWithChildren<Props>) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);

  const Component = asChild ? Slot : 'span';

  const updatePopover = (hover: boolean, focus: boolean) => {
    setHover(hover);
    setFocus(focus);
    setOpen(hover || focus);
  };

  return (
    <Popover
      content={(
        <div id={id} style={withPalette(palette)} className={styles.tooltip}>
          {content}
        </div>
      )}
      open={open}
      asChild={true}
    >
      <Component
        aria-labelledby={id}
        onClick={() => updatePopover(false, false)}
        onMouseEnter={() => updatePopover(true, focus)}
        onMouseLeave={() => updatePopover(false, focus)}
        onFocus={() => updatePopover(hover, true)}
        onBlur={() => updatePopover(hover, false)}
      >
        {children}
      </Component>
    </Popover>
  );
}
