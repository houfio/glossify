import { config } from '@fortawesome/fontawesome-svg-core';
import stylesheet from '@fortawesome/fontawesome-svg-core/styles.css';
import { faExplosion } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cssBundleHref } from '@remix-run/css-bundle';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import type { LinksFunction } from '@vercel/remix';

import styles from './root.css';

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
        <Outlet/>
        <ScrollRestoration/>
        <Scripts/>
        <LiveReload/>
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  return (
    <html>
      <head>
        <title>Something went wrong | Glossify</title>
        <Meta/>
        <Links/>
      </head>
      <body>
        <div className="error-boundary">
          <FontAwesomeIcon icon={faExplosion} size="xl"/>
          Whoops, something went wrong
        </div>
        <Scripts/>
      </body>
    </html>
  );
}
