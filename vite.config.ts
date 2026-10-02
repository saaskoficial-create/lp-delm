import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { createLeadService } from './server/lead-service.ts'
import { handleNodeRequest } from './server/node-handler.ts'

function localLeadApi(webhook: string | undefined): Plugin {
  const service = createLeadService({ getWebhookUrl: () => webhook })
  return {
    name: 'delm-local-lead-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.split('?')[0] !== '/api/leads') return next()
        void handleNodeRequest(req, res, service)
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.split('?')[0] !== '/api/leads') return next()
        void handleNodeRequest(req, res, service)
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss(), localLeadApi(env.LEAD_WEBHOOK_URL)],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    build: {
      target: 'es2022',
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              { name: 'react-vendor', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/, priority: 30 },
              { name: 'motion-vendor', test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/, priority: 25 },
              { name: 'gsap-vendor', test: /node_modules[\\/](gsap|@gsap)[\\/]/, priority: 25 },
              { name: 'form-vendor', test: /node_modules[\\/](react-hook-form|zod|@hookform)[\\/]/, priority: 20 },
            ],
          },
        },
      },
    },
  }
})
