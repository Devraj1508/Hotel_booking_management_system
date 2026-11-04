import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  if (command === 'build' && !env.VITE_API_BASE_URL?.trim()) {
    throw new Error('VITE_API_BASE_URL must be configured before building for production');
  }

  return { plugins: [react()] };
});
