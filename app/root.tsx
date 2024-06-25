import { config } from '@fortawesome/fontawesome-svg-core';
import { faExplosion } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useStore } from '@nanostores/react';
import { Theme } from '@prisma/client';
import { Slot } from '@radix-ui/react-slot';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError
} from '@remix-run/react';
import type { MetaFunction } from '@vercel/remix';
import { unstable_defineLoader } from '@vercel/remix';
import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';

import './root.scss';

import { Toast } from '~/components/popovers/Toast';
import { db } from '~/db.server';
import { getMessage, getUserId } from '~/session.server';
import { $toasts, openToast } from '~/stores/toasts';

config.autoAddCss = false;

export const meta: MetaFunction = () => [{ title: 'Glossify' }];

export const loader = unstable_defineLoader(async ({ request, response }) => {
  const userId = await getUserId(request);
  const message = await getMessage(request, response);
  let theme: Theme = Theme.AUTOMATIC;

  if (userId) {
    const user = await db.user.findUniqueOrThrow({
      where: { id: userId },
      select: { theme: true }
    });

    theme = user.theme;
  }

  return {
    message,
    theme: theme.toLowerCase()
  };
});

export function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Mono:wght@100..900&family=Noto+Sans:wght@100..900&display=swap"
        />
        <Meta />
        <Links />
      </head>
      <Slot>{children}</Slot>
    </html>
  );
}

export default function Root() {
  const data = useLoaderData<typeof loader>();
  const toasts = useStore($toasts);

  useEffect(() => {
    if (data.message) {
      const [type, msg] = data.message;

      openToast(msg, type);
    }
  }, [data]);

  return (
    <body className={data.theme}>
      <Outlet />
      {toasts.map((toast, i) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} index={toasts.length - i - 1} />
      ))}
      <ScrollRestoration />
      <Scripts />
    </body>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  console.error(error);

  return (
    <body className="error-boundary">
      <FontAwesomeIcon icon={faExplosion} size="xl" />
      {isRouteErrorResponse(error) ? (
        <>
          <span>
            {error.status} {error.statusText}
          </span>
          <pre className="error-boundary-info">{JSON.stringify(error.data, undefined, 2)}</pre>
        </>
      ) : (
        <>
          Oh no, something went wrong
          {error instanceof Error && <pre className="error-boundary-info">{error.stack}</pre>}
        </>
      )}
      <Scripts />
    </body>
  );
}
