import react from '@vitejs/plugin-react'
import proxy from './proxy'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    preserveSymlinks: true,
  },
  plugins: [
    react(),
    visualizer({
      filename: './dist/public/stats.html',
    }),
  ],
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
})
