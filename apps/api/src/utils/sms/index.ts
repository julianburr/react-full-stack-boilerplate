import logProvider from './log';

const providers = {
  log: logProvider,
  twilio: null,
};

export type SMSProvider = {
  send: (opts: { from: string; to: string; message: string }) => Promise<void>;
};

export function getSmsProvider() {
  const provider = process.env.SMS_PROVIDER;
  return providers[provider as keyof typeof providers] || providers.log;
}
