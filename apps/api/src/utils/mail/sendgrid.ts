import sendgrid from '@sendgrid/mail';

import type { MailProvider } from '~/utils/mail';

const sendgridProvider: MailProvider = {
  send: async (opts) => {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY is not set');
    }

    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    await sendgrid.send({
      from: opts.from || 'noreply@localhost',
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    });
  },
};

export default sendgridProvider;
