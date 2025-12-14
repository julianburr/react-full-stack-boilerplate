import Phase from '@phase.dev/phase-node';

import type { Provider } from '../utils/providers';

const phaseProvider: Provider = {
  get: async ({ key }) => {
    const token = process.env.PHASE_TOKEN;
    if (!token) {
      throw new Error('PHASE_TOKEN environment variable not set');
    }

    const phase = new Phase(token);

    const [appId, envName, secretKey] = key.split('/');
    const value = await phase.get({ appId, envName, key: secretKey });
    return value[0].value;
  },
};

export default phaseProvider;
