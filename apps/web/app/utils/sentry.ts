import * as Sentry from '@sentry/react-router';

export function setupSentry() {
  if (!process.env.VITE_SENTRY_DSN) {
    return;
  }

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    release: import.meta.env.VITE_RELEASE_VERSION || '0.0.0-local.0',
    environment: import.meta.env.VITE_ENV || 'local',
    sendDefaultPii: true,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({ maskAllText: false, blockAllMedia: false }),
      Sentry.feedbackIntegration({ autoInject: false }),
    ],
    tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.3,
    replaysSessionSampleRate: 1,
    replaysOnErrorSampleRate: 1,
  });
}
