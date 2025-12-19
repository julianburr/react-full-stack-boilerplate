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
    name: 'api',
    level: process.env.PINO_LOG_LEVEL || 'info',
    timestamp: pino.stdTimeFunctions.isoTime,

    redact: ['req.headers.authorization', 'req.headers.cookie'],
  },
  transport,
);
