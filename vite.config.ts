import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Connect } from 'vite';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = dirname(fileURLToPath(import.meta.url));

const chatConfigData = JSON.parse(
  readFileSync(join(__dirname, 'chat-config.json'), 'utf-8'),
) as {
  widget: { id: string; apiKey: string; [key: string]: unknown };
  [key: string]: unknown;
};

function chatConfigApiMiddleware(): Connect.NextHandleFunction {
  return (req, res, next) => {
    const pathname = req.url?.split('?')[0] ?? '';
    if (pathname !== '/api/chat-config') {
      return next();
    }

    const url = new URL(req.url ?? '/', 'http://localhost');
    const key = url.searchParams.get('key');
    const widgetId = url.searchParams.get('widget');

    const payload = structuredClone(chatConfigData);
    if (key !== null) payload.widget.apiKey = key;
    if (widgetId !== null) payload.widget.id = widgetId;

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(payload));
  };
}

function chatConfigApiPlugin(): Plugin {
  return {
    name: 'chat-config-api',
    configureServer(server) {
      server.middlewares.use(chatConfigApiMiddleware());
    },
    configurePreviewServer(server) {
      server.middlewares.use(chatConfigApiMiddleware());
    },
  };
}

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
    plugins: [react(), chatConfigApiPlugin()],
    define,
  };
});
