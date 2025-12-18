import mailhogProvider from '~/utils/mail/mailhog';
import sendgridProvider from '~/utils/mail/sendgrid';

export const providers = {
  mailhog: mailhogProvider,
  sendgrid: sendgridProvider,
};

type SendOptions = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
};

export type MailProvider = {
  send: (opts: SendOptions) => Promise<void>;
};

export function getMailProvider() {
  const provider = process.env.MAIL_PROVIDER;
  return providers[provider as keyof typeof providers] || providers.mailhog;
}
