import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
    proxy: {
      '/v7/weather': {
        target: 'https://devapi.qweather.com',
        changeOrigin: true,
      },
      '/v2/city': {
        target: 'https://geoapi.qweather.com',
        changeOrigin: true,
      },
    },
  },
}
