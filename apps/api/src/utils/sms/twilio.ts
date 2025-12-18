import twilio from 'twilio';

import type { SMSProvider } from '.';

const twilioProvider: SMSProvider = {
  send: async ({ from, to, message }) => {
    if (
      !process.env.TWILIO_ACCOUNT_SID ||
      !process.env.TWILIO_AUTH_TOKEN ||
      !process.env.TWILIO_PHONE_NUMBER
    ) {
      throw new Error('TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER are not set');
    }

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      from,
      to,
      body: message,
    });
  },
};

export default twilioProvider;
