import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: /^~/, replacement: '' }],
  },
  build: {
    outDir: './dist/public',
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  server: {
    port: 8000,
    proxy: {
      '/api': {
        target: 'http://localhost:3606',
      },
    },
  },
})
