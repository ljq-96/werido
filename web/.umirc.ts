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
  routes: [
    {
      exact: false,
      path: '/',
      component: '@/layouts',
      routes: [
        {
          path: '/manage',
          title: 'biaoqian',
          icon: 'HomeOutlined',
          component: 'manage',
        },
      ]
    },
  ],
})
