import { Flagsmith } from 'flagsmith-nodejs';

let flagsmithClient: Flagsmith | null = null;
export function getFlagsmithClient() {
  if (flagsmithClient) {
    return flagsmithClient;
  }

  if (!process.env.FLAGSMITH_SERVER_KEY) {
    throw new Error('FLAGSMITH_SERVER_KEY is not set');
  }

  flagsmithClient = new Flagsmith({ environmentKey: process.env.FLAGSMITH_SERVER_KEY });
  return flagsmithClient;
}
