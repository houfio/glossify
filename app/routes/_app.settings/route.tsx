import { faShieldHalved, faUser } from '@fortawesome/pro-regular-svg-icons';
import { Outlet } from '@remix-run/react';
import type { MetaFunction } from '@vercel/remix';

import styles from './route.module.scss';

import { Navigation } from '~/components/Navigation';
import { Container } from '~/components/layout/Container';
import { Grid } from '~/components/layout/Grid';
import { Header } from '~/components/layout/Header';
import { Span } from '~/components/layout/Span';

export const meta: MetaFunction = () => [
  { title: 'Glossify / Settings' }
];

export default function Settings() {
  return (
    <>
      <Header>
        Settings
      </Header>
      <Container>
        <Grid columns={{ laptop: 3, desktop: 4 }} gaps={{ phone: 2 }}>
          <div className={styles.separator}>
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
          </div>
          <Span span={{ laptop: 2, desktop: 3 }} asChild={true}>
            <div className={styles.content}>
              <Outlet/>
            </div>
          </Span>
        </Grid>
      </Container>
    </>
  );
}
