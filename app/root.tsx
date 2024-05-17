import { config } from '@fortawesome/fontawesome-svg-core';
import { faExplosion } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useStore } from '@nanostores/react';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError
} from '@remix-run/react';
import type { MetaFunction } from '@vercel/remix';
import { unstable_defineLoader } from '@vercel/remix';
import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';

import './root.scss';

import { Toast } from '~/components/popovers/Toast';
import { getMessage } from '~/session.server';
import { $toasts, openToast } from '~/stores/toasts';

config.autoAddCss = false;

export const meta: MetaFunction = () => [
  { title: 'Glossify' }
];

export const loader = unstable_defineLoader(async ({ request, response }) => {
  const message = await getMessage(request, response);

  return { message };
});

export function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Mono:wght@100..900&family=Noto+Sans:wght@100..900&display=swap"/>
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
  const data = useLoaderData<typeof loader>();
  const toasts = useStore($toasts);

  useEffect(() => {
    if (data.message) {
      const [type, msg] = data.message;

      openToast(msg, type);
    }
  }, [data]);

  return (
    <>
      <Outlet/>
      {toasts.map((toast, i) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          index={toasts.length - i - 1}
        />
      ))}
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  console.error(error);

  return (
    <div className="error-boundary">
      <FontAwesomeIcon icon={faExplosion}/>
      {isRouteErrorResponse(error) ? (
        <>
          <span>
            {error.status} {error.statusText}
          </span>
          <pre className="error-boundary-info">
            {JSON.stringify(error.data, undefined, 2)}
          </pre>
        </>
      ) : error instanceof Error ? (
        <>
          {error.message}
          <pre className="error-boundary-info">
            {error.stack}
          </pre>
        </>
      ) : (
        <>
          Oh no, something went very wrong
        </>
      )}
    </div>
  );
}
