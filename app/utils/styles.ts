import type { CSSProperties } from 'react';

export function mapStyles(styles: CSSModuleClasses, object: Record<string, unknown>, template: string) {
  const entries = Object.entries(object);

  return entries.map(([key, value]) => {
    const mapped = template.replace('$key', key).replace('$value', String(value));

    return styles[mapped];
  });
}

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
