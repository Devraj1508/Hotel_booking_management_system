const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

if (!configuredApiBaseUrl && !import.meta.env.DEV) {
  throw new Error('VITE_API_BASE_URL must be configured for production builds');
}

export const env = {
  apiBaseUrl: configuredApiBaseUrl || 'http://localhost:5000/api'
};
