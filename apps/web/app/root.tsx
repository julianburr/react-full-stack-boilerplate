import { ClerkProvider } from '@clerk/react-router';
import { clerkMiddleware, getAuth, rootAuthLoader } from '@clerk/react-router/server';
import { IconContext } from '@phosphor-icons/react';
import * as Sentry from '@sentry/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as R from 'react-router';

import type { Route } from './+types/root';

import { DialogStack, DialogStackProvider } from '~/components/dialog';
import { Heading, P } from '~/components/text';
import { Toaster } from '~/components/toaster';
import { api } from '~/utils/api';
import { AuthProvider } from '~/utils/auth/auth-context';
import { logger } from '~/utils/logger.server';

import './app.css';

/**
 * Clerk middleware
 */
export const middleware: Route.MiddlewareFunction[] = [
  clerkMiddleware({
    organizationSyncOptions: {
      organizationPatterns: ['/dashboard/:slug'],
    },
  }) as any,
];

/**
 * Root loader to fetch meta information about current user session
 * Only runs on initial page load, not on client-side navigation
 */
export const loader = async (args: Route.LoaderArgs) => {
  const auth = await rootAuthLoader(args);
  const clerk = await getAuth(args, { acceptsToken: ['session_token'] });

  api.setUrl(import.meta.env.VITE_API_URL!);
  api.setGetToken(clerk.getToken);
  const me = await api('/me');

  return { auth, ...me.data };
};

/**
 * Prevent loader from re-running on client-side navigation
 * It will still run on initial page load and SSR
 */
export const shouldRevalidate = () => false;

/**
 * Page header links
 */
export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap',
  },
];

/**
 * Renderers
 */
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <R.Meta />
        <R.Links />
      </head>
      <body>
        {children}
        <R.ScrollRestoration />
        <R.Scripts />
      </body>
    </html>
  );
}

const queryClient = new QueryClient();

export default function App({ loaderData }: Route.ComponentProps) {
  const { auth, ...rest } = loaderData;
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider loaderData={auth}>
        <AuthProvider value={rest}>
          <DialogStackProvider>
            <IconContext.Provider value={{ weight: 'bold', size: 16 }}>
              <R.Outlet />
              <DialogStack />
              <Toaster />
            </IconContext.Provider>
          </DialogStackProvider>
        </AuthProvider>
      </ClerkProvider>
    </QueryClientProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (typeof window === 'undefined') {
    logger.fatal(error);
  } else {
    Sentry.captureException(error);
  }

  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (R.isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="flex flex-col w-full h-full items-center justify-center">
      <div className="flex flex-col p-6 w-full max-w-[620px]">
        <Heading level={1} size="xl">
          {message}
        </Heading>
        <P className="mt-2">{details}</P>

        {stack && (
          <pre className="w-full p-4 overflow-x-auto">
            <code>{stack}</code>
          </pre>
        )}
      </div>
    </main>
  );
}
