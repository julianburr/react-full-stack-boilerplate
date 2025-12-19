/**
 * Cloudflare Pages Function for Fastify API
 *
 * This uses Cloudflare Pages Functions which run in a Node.js-compatible runtime,
 * allowing us to use the existing Fastify app without any adapters.
 *
 * The function imports from the built dist directory. The build happens as part of
 * the Pages deployment process (configured in infrastructure/index.ts).
 */

import fastify from 'fastify';

// Import from built dist (built during Pages deployment)
import { app, options } from '../dist/app';

// Initialize Fastify instance (reused across requests for performance)
let fastifyInstance: ReturnType<typeof fastify> | null = null;

async function getFastifyInstance() {
  if (!fastifyInstance) {
    fastifyInstance = fastify(options);
    await fastifyInstance.register(app, options);
    await fastifyInstance.ready();
  }
  return fastifyInstance;
}

export async function onRequest(context: any): Promise<Response> {
  const { request } = context;

  try {
    const instance = await getFastifyInstance();

    // Get request body if present
    let body: string | undefined;
    if (request.body) {
      body = await request.text();
    }

    // Convert Fetch Request to format Fastify inject expects
    const url = new URL(request.url);
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Use Fastify's inject method (designed for testing but works great for serverless)
    const response = await instance.inject({
      method: request.method as any,
      url: url.pathname + url.search,
      headers,
      payload: body,
      remoteAddress: request.headers.get('cf-connecting-ip') || undefined,
    });

    // Convert Fastify response to Fetch Response
    const responseHeaders = new Headers();
    Object.entries(response.headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        responseHeaders.set(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((v) => {
          if (typeof v === 'string') {
            responseHeaders.append(key, v);
          }
        });
      }
    });

    return new Response(response.body || response.payload || null, {
      status: response.statusCode,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Pages Function error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
