import { config } from '@fortawesome/fontawesome-svg-core';
import stylesheet from '@fortawesome/fontawesome-svg-core/styles.css';
import { faExplosion } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cssBundleHref } from '@remix-run/css-bundle';
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError
} from '@remix-run/react';
import type { LinksFunction } from '@vercel/remix';
import { Dialoog, DialoogProvider } from 'dialoog';
import Confetti from 'react-confetti';
import { ClientOnly } from 'remix-utils';

import styles from './root.css';

import { useWindowSize } from '~/hooks/useWindowSize';

config.autoAddCss = false;

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Lora:wght@500&family=Noto+Color+Emoji&family=Open+Sans:wght@400;600&display=swap'
  },
  { rel: 'stylesheet', href: styles },
  { rel: 'stylesheet', href: stylesheet },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : [])
];

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <Meta/>
        <Links/>
      </head>
      <body>
        <DialoogProvider>
          <Outlet/>
          <Dialoog/>
        </DialoogProvider>
        <ScrollRestoration/>
        <Scripts/>
        <LiveReload/>
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const { width, height } = useWindowSize();
  const error = useRouteError();

  return (
    <html>
      <head>
        <title>Something went wrong | Glossify</title>
        <Meta/>
        <Links/>
      </head>
      <body>
        <ClientOnly>
          {() => (
            <Confetti width={width} height={height}/>
          )}
        </ClientOnly>
        <div className="error-boundary">
          <FontAwesomeIcon icon={faExplosion} size="xl"/>
          <span>
            Whoops, something went wrong
          </span>
          <pre className="error-boundary-info">
            {isRouteErrorResponse(error) ? JSON.stringify(error.data, undefined, 2) : error instanceof Error && error.stack}
          </pre>
        </div>
        <Scripts/>
      </body>
    </html>
  );
}
