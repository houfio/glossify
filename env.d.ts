export {};

declare global {
  const __VERSION__: string;
}

declare module 'react' {
  interface HTMLAttributes<T> {
    autofocus?: string | undefined;
  }

  interface CSSProperties {
    anchorName?: string | undefined;
    positionAnchor?: string | undefined;
  }
}
