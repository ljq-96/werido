import { defineConfig } from 'umi'

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  fastRefresh: {},
  dva: {
    immer: true,
    hmr: false,
  },
  proxy: {
    '/api': {
      target: 'http://localhost:4000',
      pathRewrite: { '^/api': '/api' },
      changeOrigin: true
    }
  },
  routes: [
    {
      path: '/login',
      component: 'login'
    },
    {
      path: '/',
      component: '@/layouts',
      routes: [
        {
          path: '/manage',
          title: 'biaoqian',
          icon: 'HomeOutlined',
          component: 'Manage',
        },
      ]
    },
  ],
})
