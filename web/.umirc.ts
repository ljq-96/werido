import { defineConfig } from 'umi'
import routes from './src/routes'

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  fastRefresh: {},
  dva: {
    immer: true,
    hmr: false,
  },
  routes,
})
