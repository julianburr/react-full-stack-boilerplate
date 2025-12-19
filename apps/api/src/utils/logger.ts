import pino from 'pino';

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
    { target: 'pino-pretty' },
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
