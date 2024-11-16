import { type RouteConfig, index, route, layout } from '@react-router/dev/routes';

export const routes: RouteConfig = [
  layout('routes/_layout.tsx', [
    index('routes/_index.tsx'),
  ]),
  layout('routes/_auth/_layout.tsx', [
    route('/login', 'routes/_auth/login.tsx'),
    route('/register', 'routes/_auth/register.tsx'),
    route('/logout', 'routes/_auth/logout.ts')
  ])
];
