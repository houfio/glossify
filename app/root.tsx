import './root.scss';

import { config } from '@fortawesome/fontawesome-svg-core';
import { useStore } from '@nanostores/react';
import { type PropsWithChildren, useEffect } from 'react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, data } from 'react-router';
import { Toast } from '~/components/popovers/Toast.tsx';
import { getMessage } from '~/session.server.ts';
import { $toasts, openToast } from '~/stores/toasts.ts';
import type { Route } from './+types/root.ts';

config.autoAddCss = false;

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { message, headers } = await getMessage(request);

  return data({ message }, { headers });
};

export function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  const toasts = useStore($toasts);

  useEffect(() => {
    if (loaderData.message) {
      const [message, palette] = loaderData.message;

      openToast(message, palette);
    }
  }, [loaderData]);

  return (
    <>
      <Outlet />
      {toasts.map((toast, i) => (
        <Toast key={toast.id} message={toast.message} palette={toast.palette} index={toasts.length - i - 1} />
      ))}
    </>
  );
}
