/* eslint-disable @typescript-eslint/no-require-imports */
const Fastify = require('fastify');

const { default: appPlugin, options } = require('./dist/core.js'); // or "./dist/core.js"

const fastify = Fastify(options);
fastify.register(appPlugin);

const port = Number(process.env.PORT || 3000);
fastify.listen({ port, host: '0.0.0.0' }).catch((err) => {
  fastify.log.error(err);
  process.exit(1);
});
