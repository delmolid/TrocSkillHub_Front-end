import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { playwright } from '@vitest/browser-playwright'

// https://vite.dev/config/
const rootDir = path.resolve(__dirname, '..')

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, '')
  const backendUrl = env.VITE_API_PROXY_TARGET

  if (mode === 'development' && !backendUrl) {
    throw new Error('VITE_API_PROXY_TARGET must be defined in .env')
  }

  return {
    envDir: rootDir,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    ...(mode === 'development' && backendUrl
      ? {
          server: {
            proxy: {
              '/api': {
                target: backendUrl,
                changeOrigin: true,
              },
            },
          },
        }
      : {}),
    test: {
      browser: {
        enabled: true,
        provider: playwright(),
        instances: [{ browser: "firefox" }],
      },
    },
  }
})
