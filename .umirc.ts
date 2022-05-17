import { defineConfig } from 'umi'
import config from './config'

export default defineConfig({
  nodeModulesTransform: {
    type: 'none'
  },
  publicPath: '/pubilc/',
  outputPath: './dist/public',
  hash: true,
  // mfsu: {},
  dynamicImport: {
    loading: '@/components/Loading',
  },
  // antd: {
  //   // disableBabelPluginImport: true
  // },
  extraPostCSSPlugins: [
    require('tailwindcss'),
    require('autoprefixer')
  ],
  theme: {
    'root-entry-name': 'variable'
  },
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
      path: '/manage',
      component: '@/layouts',
      routes: [
        {
          path: '/home',
          title: '返回首页',
          icon: 'RollbackOutlined',
          component: 'Home'
        },
        {
          path: '/manage/editor',
          title: '新建文章',
          icon: 'FileTextOutlined',
          component: 'Editor'
        }
      ]
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
          path: '/manage/editor',
          title: '管理系统',
          icon: 'LaptopOutlined',
          component: 'Editor'
        }
      ]
    },
  ]
})
