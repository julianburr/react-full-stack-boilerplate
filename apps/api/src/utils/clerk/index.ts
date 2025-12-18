import { createClerkClient } from '@clerk/backend';

import type { ClerkClient } from '@clerk/backend';

let clerkClient: ClerkClient | null = null;

export function getClerkClient() {
  if (clerkClient) {
    return clerkClient;
  }

  if (!process.env.CLERK_SECRET_KEY) {
    throw new Error('CLERK_SECRET_KEY is not set');
  }

  clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
  return clerkClient;
}
