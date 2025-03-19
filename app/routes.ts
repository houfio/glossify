import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  layout('routes/_layout.tsx', [
    index('routes/_index.tsx'),
    route('practises', 'routes/practises/_index.tsx'),
    route('practises/:id', 'routes/practises/practise.tsx')
  ]),
  layout('routes/_auth/_layout.tsx', [
    route('/login', 'routes/_auth/login.tsx'),
    route('/register', 'routes/_auth/register.tsx'),
    route('/logout', 'routes/_auth/logout.ts')
  ])
] satisfies RouteConfig;
