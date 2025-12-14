import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/index.tsx'),

  // Auth
  route('/auth/sign-in', 'routes/auth/sign-in.tsx'),
  route('/auth/sign-up', 'routes/auth/sign-up.tsx'),
  route('/auth/sign-out', 'routes/auth/sign-out.tsx'),
  route('/auth/oauth/complete', 'routes/auth/oauth/complete.tsx'),

  // Dashboard
  route('/dashboard', 'routes/dashboard/index.tsx'),
  route('/dashboard/setup', 'routes/dashboard/setup.tsx'),
  route('/dashboard/:orgSlug', 'routes/dashboard/[orgSlug].tsx'),
] satisfies RouteConfig;
