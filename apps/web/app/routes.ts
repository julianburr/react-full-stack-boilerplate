import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  index('routes/index.tsx'),

  // Auth
  layout('layouts/auth.tsx', [
    route('/auth/sign-in', 'routes/auth.sign-in.tsx'),
    route('/auth/sign-up', 'routes/auth.sign-up.tsx'),
    route('/auth/sign-up/verify', 'routes/auth.sign-up.verify.tsx'),
    route('/auth/sign-out', 'routes/auth.sign-out.tsx'),
    route('/auth/oauth', 'routes/auth.oauth.tsx'),
    route('/auth/oauth/complete', 'routes/auth.oauth.complete.tsx'),
  ]),

  // Team setup
  layout('layouts/setup.tsx', [route('/setup', 'routes/setup.tsx')]),

  // Dashboard
  layout('layouts/dashboard.tsx', [
    route('/dashboard', 'routes/dashboard.tsx'),
    route('/dashboard/:orgSlug', 'routes/dashboard.$orgSlug.tsx'),
    route('/dashboard/:orgSlug/team-settings', 'routes/dashboard.$orgSlug.team-settings.tsx'),
  ]),
] satisfies RouteConfig;
