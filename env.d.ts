export {};

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T> {
    autofocus?: string | undefined;
    popover?: string | 'auto' | 'manual' | undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ButtonHTMLAttributes<T> {
    popovertarget?: string | undefined;
    popovertargetaction?: string | 'hide' | 'show' | 'toggle' | undefined;
  }

  interface CSSProperties {
    anchorName?: string | undefined;
    positionAnchor?: string | undefined;
    insetArea?: string | undefined;
  }
}
