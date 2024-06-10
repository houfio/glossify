import { faShieldHalved, faUser } from '@fortawesome/pro-regular-svg-icons';
import { Outlet } from '@remix-run/react';
import type { MetaFunction } from '@vercel/remix';

import styles from './route.module.scss';

import { Navigation } from '~/components/Navigation';
import { Container } from '~/components/layout/Container';
import { Grid } from '~/components/layout/Grid';
import { Span } from '~/components/layout/Span';

export const meta: MetaFunction = () => [
  { title: 'Glossify / Settings' }
];

export default function Settings() {
  return (
    <>
      <div className={styles.title}>
        <Container>
          Settings
        </Container>
      </div>
      <Container>
        <Grid columns={{ laptop: 3, desktop: 4 }} gaps={{ phone: 2 }}>
          <Navigation
            items={[{
              title: 'Profile',
              icon: faUser,
              to: '/settings',
              end: true
            }, {
              title: 'Security',
              icon: faShieldHalved,
              to: '/settings/security'
            }]}
            orientation="vertical"
            palette="background"
          />
          <Span span={{ laptop: 2, desktop: 3 }}>
            <Outlet/>
          </Span>
        </Grid>
      </Container>
    </>
  );
}
