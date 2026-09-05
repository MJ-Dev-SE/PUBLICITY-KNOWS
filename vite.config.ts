import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Dev-only plugin that serves /api/analyze using the same handler Vercel runs
// in production, so the AI features work during local development.
function apiProxy(): Plugin {
  return {
    name: 'api-proxy',
    configureServer(server) {
      const env = loadEnv('development', process.cwd(), '');
      Object.assign(process.env, env);

      server.middlewares.use('/api/analyze', async (req, res) => {
        let body = {};
        if (req.method === 'POST') {
          const raw = await new Promise<string>((resolve) => {
            let data = '';
            req.on('data', (chunk: Buffer) => { data += chunk; });
            req.on('end', () => resolve(data));
          });
          try { body = JSON.parse(raw); } catch { /* empty body */ }
        }

        const mod = await server.ssrLoadModule('/api/analyze.ts');
        const handler = mod.default as (
          req: unknown,
          res: unknown,
        ) => Promise<void>;

        let statusCode = 200;
        const apiRes = {
          status(code: number) { statusCode = code; return apiRes; },
          json(payload: unknown) {
            res.writeHead(statusCode, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(payload));
          },
          setHeader(name: string, value: string) { res.setHeader(name, value); },
        };

        await handler(
          { method: req.method, headers: req.headers, body },
          apiRes,
        );
      });
    },
  };
}

export default defineConfig({
  plugins: [apiProxy(), react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'recharts'],
  },
})
