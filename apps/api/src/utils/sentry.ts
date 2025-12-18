import * as Sentry from '@sentry/node';

export function setupSentry() {
  if (!process.env.SENTRY_DSN) {
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    release: process.env.RELEASE_VERSION || '0.0.0-local.0',
    environment: process.env.ENV || 'local',
    sendDefaultPii: true,
    integrations: [Sentry.pinoIntegration()],
    tracesSampleRate: process.env.NODE_ENV !== 'production' ? 1.0 : 0.3,
  });
}
