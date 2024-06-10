import type { CSSProperties } from 'react';

export function withPalette(name: string) {
  return {
    '--color': `var(--${name})`,
    '--on-color': `var(--on-${name})`,
    '--on-color-subtle': `var(--on-${name}-subtle)`,
    '--color-hover': `var(--${name}-hover)`,
    '--color-click': `var(--${name}-click)`,
    '--color-outline': `var(--${name}-outline)`
  } as CSSProperties;
}
