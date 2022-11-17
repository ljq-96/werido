import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import proxy from './proxy'

// https://vitejs.dev/config/
export default {
  plugins: [react()],
  define: process.env.NODE_ENV === 'development' ? { module: undefined } : {},
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
    proxy,
  },
}
