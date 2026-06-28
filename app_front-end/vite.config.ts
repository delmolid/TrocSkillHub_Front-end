import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { playwright } from '@vitest/browser-playwright'

const rootDir = path.resolve(__dirname, '..')

export default defineConfig(({ mode }) => {
  loadEnv(mode, rootDir, '')

  return {
    base: '/',
    envDir: rootDir,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    test: {
      browser: {
        enabled: true,
        provider: playwright(),
        instances: [{ browser: 'firefox' }],
      },
    },
  }
})
