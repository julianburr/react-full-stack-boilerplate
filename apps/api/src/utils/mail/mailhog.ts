import nodemailer from 'nodemailer';

import type { MailProvider } from '~/utils/mail';

const mailhogProvider: MailProvider = {
  send: async (opts) => {
    if (!process.env.MAILHOG_HOST || !process.env.MAILHOG_PORT) {
      throw new Error('MAILHOG_HOST and MAILHOG_PORT are not set');
    }

    const smtpHost = process.env.MAILHOG_HOST;
    const smtpPort = Number.parseInt(process.env.MAILHOG_PORT);

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false,
      auth: false,
    } as any);

    await transporter.sendMail({
      from: opts.from || 'noreply@localhost',
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    });
  },
};

export default mailhogProvider;
