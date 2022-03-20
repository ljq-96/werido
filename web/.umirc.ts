import { defineConfig } from 'umi'
const config = require('../config.json')

export default defineConfig({
  nodeModulesTransform: {
    type: 'none'
  },
  publicPath: '/pubilc/',
  outputPath: '../dist/public',
  hash: true,
  // mfsu: {},
  dynamicImport: {},
  // antd: {
  //   // disableBabelPluginImport: true
  // },
  extraPostCSSPlugins: [
    require('tailwindcss'),
  ],
  // theme: {
  //   'root-entry-name': 'variable'
  // },
  history: {
    type: 'hash'
  },
  fastRefresh: {},
  dva: {
    immer: true,
    hmr: false
  },
  proxy: {
    '/api': {
      target: `${config.serve.url}:${config.serve.port}`,
      pathRewrite: { '^/api': '/api' },
      changeOrigin: true
    }
  },
  routes: [
    {
      path: '/login',
      component: 'Login'
    },
    {
      path: '/',
      component: '@/layouts',
      routes: [
        {
          path: '/home',
          title: '首页',
          icon: 'HomeOutlined',
          component: 'Home'
        },
        {
          path: '/editor',
          title: '新建文章',
          icon: 'FileTextOutlined',
          component: 'Editor'
        }
      ]
    }
  ]
})
