import { ClerkProvider } from '@clerk/react-router';
import { rootAuthLoader } from '@clerk/react-router/server';
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
import { logger } from '~/utils/logger/index.server';

import './app.css';

/**
 * Root loader to fetch meta information about current user session
 * Only runs on initial page load, not on client-side navigation
 */
export const loader = async (args: Route.LoaderArgs) => {
  return rootAuthLoader(
    args,
    async ({ request }) => {
      api.setUrl(import.meta.env.VITE_API_URL!);
      api.setGetToken(request.auth.getToken);
      const me = await api('/me');

      console.log({ me });

      const sessionContext = {
        isSignedIn: !!me.isAuthenticated,
        userId: me.user?.id,
        userEmail: me.user?.emailAddresses[0].emailAddress,
        orgId: me.team?.id,
        orgSlug: me.team?.slug,
        orgName: me.team?.name,
        flags: me.flags,
      };

      const path = new URL(args.request.url).pathname;
      logger.info({ isRequestLog: true, statusCode: 200, session: sessionContext }, `GET ${path}`);

      return { me };
    },
    {
      publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
      secretKey: process.env.CLERK_SECRET_KEY,
    },
  );
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
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider
        publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
        loaderData={loaderData}
      >
        <AuthProvider value={loaderData.me}>
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
  Sentry.captureException(error);

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
