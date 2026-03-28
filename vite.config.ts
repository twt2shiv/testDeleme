import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/** ajaxter-chat reads `process.env.REACT_APP_*` (CRA-style). Vite only injects `import.meta.env` unless we define these. */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const define: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    if (
      key.startsWith('REACT_APP_') ||
      key.startsWith('NEXT_PUBLIC_') ||
      /^CHAT_/.test(key)
    ) {
      define[`process.env.${key}`] = JSON.stringify(value);
    }
  }
  return {
    plugins: [react()],
    define,
  };
});
