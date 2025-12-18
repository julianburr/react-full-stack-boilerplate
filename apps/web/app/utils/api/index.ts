type GetTokenFn = () => Promise<string | null>;

let getToken: undefined | GetTokenFn;
let baseUrl: string | null;

export async function api(path: string, options: RequestInit & { data?: object } = {}) {
  const finalOptions = {
    ...options,
    method: options.method || 'GET',
    headers: {
      ...options.headers,
    },
  } as any;

  // QoL: Automatically stringify body if it's an object
  if (finalOptions.method !== 'GET' && options.data) {
    finalOptions.headers['Content-Type'] = 'application/json';
    finalOptions.body = JSON.stringify(options.data);
  }

  // Add session token to headers if user is authenticated
  const sessionToken = await getToken?.();
  if (sessionToken) {
    finalOptions.headers.Authorization = `Bearer ${sessionToken}`;
  }

  const res = await fetch(`${baseUrl}${path}`, finalOptions);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.json();
}

api.setUrl = (newBaseUrl: string) => {
  baseUrl = newBaseUrl;
};

api.setGetToken = (newGetToken: undefined | GetTokenFn) => {
  getToken = newGetToken;
};
