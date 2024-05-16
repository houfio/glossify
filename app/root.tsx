import { config } from '@fortawesome/fontawesome-svg-core';
import { useStore } from '@nanostores/react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteError } from '@remix-run/react';
import type { MetaFunction } from '@vercel/remix';
import type { PropsWithChildren } from 'react';

import './root.scss';

import { Toast } from '~/components/popovers/Toast';
import { $toasts } from '~/stores/toasts';

config.autoAddCss = false;

export const meta: MetaFunction = () => [
  { title: 'Glossify' }
];

export function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family=Noto+Sans+Mono:wght@100..900&family=Noto+Sans:wght@100..900&display=swap"/>
        <Meta/>
        <Links/>
      </head>
      <body>
        {children}
        <ScrollRestoration/>
        <Scripts/>
      </body>
    </html>
  );
}

export default function Root() {
  const toasts = useStore($toasts);

  return (
    <>
      <Outlet/>
      {toasts.map((toast, i) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          index={i}
        />
      ))}
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <pre>
      {JSON.stringify(error, undefined, 2)}
    </pre>
  );
}
