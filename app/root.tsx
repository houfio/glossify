import './root.scss';

import { config } from '@fortawesome/fontawesome-svg-core';
import { type PropsWithChildren, useEffect } from 'react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, data } from 'react-router';
import { ToastRegion } from '~/components/popovers/ToastRegion.tsx';
import { getMessage } from '~/session.server.ts';
import { showToast } from '~/utils/toast.ts';
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
  useEffect(() => {
    if (loaderData.message) {
      const [message, palette] = loaderData.message;

      showToast(message, palette);
    }
  }, [loaderData]);

  return (
    <>
      <Outlet />
      <ToastRegion />
    </>
  );
}
