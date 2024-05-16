import { faShieldHalved, faUser, faUserGroup } from '@fortawesome/pro-regular-svg-icons';
import type { MetaFunction } from '@vercel/remix';

import { Container } from '~/components/Container';
import { Navigation } from '~/components/Navigation';

export const meta: MetaFunction = () => [
  { title: 'Glossify / Settings' }
];

export default function Settings() {
  return (
    <Container>
      settings
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
        }, {
          title: 'Friends',
          icon: faUserGroup,
          to: '/settings/friends'
        }]}
        orientation="vertical"
      />
    </Container>
  );
}
