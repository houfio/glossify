export {};

declare global {
  const __VERSION__: string;
}

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T> {
    autofocus?: string | undefined;
  }

  interface CSSProperties {
    anchorName?: string | undefined;
    positionAnchor?: string | undefined;
  }
}
