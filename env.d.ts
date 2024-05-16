declare namespace React {
  interface HTMLAttributes {
    popover?: 'auto' | 'manual' | undefined;
  }

  interface ButtonHTMLAttributes {
    popovertarget?: string | undefined;
    popovertargetaction?: 'hide' | 'show' | 'toggle' | undefined;
  }

  interface CSSProperties {
    anchorName?: string | undefined;
    positionAnchor?: string | undefined;
  }
}
