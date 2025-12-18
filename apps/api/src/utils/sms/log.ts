import type { SMSProvider } from '.';

const logProvider: SMSProvider = {
  send: async ({ from, to, message }) => {
    console.log(`====\nSending SMS:\nFrom: ${from}\nTo: ${to}\nMessage: ${message}\n====`);
  },
};

export default logProvider;
