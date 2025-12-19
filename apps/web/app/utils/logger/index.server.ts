import pino from 'pino';

// NOTE: this is a vercel server function quirk, we need to use an import here to
// ensure vercel is bundling the actual depenendency, since we're just referencing it
// by string in the transport target settings below
import '@logtail/pino';

const isProduction = process.env.NODE_ENV === 'production';

const transport = pino.transport({
  targets: [
    ...(process.env.LOGTAIL_SOURCE_TOKEN
      ? [
          {
            target: '@logtail/pino',
            options: {
              sourceToken: process.env.LOGTAIL_SOURCE_TOKEN,
              options: { endpoint: process.env.LOGTAIL_ENDPOINT },
            },
          },
        ]
      : []),

    ...(process.env.VITE_SENTRY_DSN
      ? [
          {
            target: 'pino-sentry-transport',
            options: {
              sentry: {
                dsn: process.env.VITE_SENTRY_DSN,
                release: process.env.VITE_RELEASE_VERSION || '0.0.0-local.0',
                environment: process.env.VITE_ENV || 'local',
                sendDefaultPii: true,
              },
            },
          },
        ]
      : []),

    ...(!isProduction
      ? [
          {
            target: 'pino-pretty',
          },
        ]
      : []),
  ],
});

export const logger = pino(
  {
    name: 'web',
    level: process.env.PINO_LOG_LEVEL || 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport,
);
