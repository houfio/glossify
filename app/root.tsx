import './root.scss';

import { config } from '@fortawesome/fontawesome-svg-core';
import { type PropsWithChildren, useEffect } from 'react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useMatches } from 'react-router';
import { ToastRegion } from '~/components/popovers/ToastRegion.tsx';
import { getSession, sessionMiddleware } from '~/middleware/session.ts';
import { showToast } from '~/utils/toast.ts';
import type { Route } from './+types/root.ts';

config.autoAddCss = false;

export const unstable_middleware: Route.unstable_MiddlewareFunction[] = [sessionMiddleware];

export const loader = async ({ context }: Route.LoaderArgs) => {
  const session = getSession(context);
  const message = session.get('message');
  const palette = session.get('palette');

  return {
    message: !message || !palette ? undefined : ([message, palette] as const)
  };
};

export const handle = {
  title: 'Glossify'
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

export default function Component({ loaderData }: Route.ComponentProps) {
  const matches = useMatches();

  const title = matches
    .map((match) => match.handle && typeof match.handle === 'object' && 'title' in match.handle ? match.handle.title : undefined)
    .filter((title) => typeof title === 'string')
    .reverse()
    .join(' / ');

  useEffect(() => {
    if (loaderData.message) {
      const [message, palette] = loaderData.message;

      showToast(message, palette);
    }
  }, [loaderData]);

  return (
    <>
      <title>{title}</title>
      <Outlet />
      <ToastRegion />
    </>
  );
}
