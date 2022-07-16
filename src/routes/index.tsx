import { lazy, useEffect } from 'react'
import {
  HomeOutlined,
  LaptopOutlined,
  RollbackOutlined,
  FileTextOutlined,
  AreaChartOutlined,
  ReadOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useNavigate, Navigator } from 'react-router-dom'
import Layout from '../layout'
import { Result } from 'antd'

const Login = lazy(() => import('../pages/Login'))
const Home = lazy(() => import('../pages/Home'))
const Editor = lazy(() => import('../pages/Editor'))
const BlogList = lazy(() => import('../pages/BlogList'))

function Redirect({ to }) {
  let navigate = useNavigate()
  useEffect(() => {
    navigate(to)
  })
  return null
}

const routes = [
  {
    path: '/login',
    name: '登陆',
    component: <Login />,
  },
  {
    path: '/',
    component: <Layout />,
    routes: [
      {
        path: '/home',
        name: '首页',
        icon: <HomeOutlined />,
        component: <Home />,
      },
      {
        path: '/blog',
        name: '文章列表',
        icon: <ReadOutlined />,
        component: <BlogList />,
      },
      {
        path: '/to_manage',
        name: '管理系统',
        icon: <LaptopOutlined />,
        component: <Redirect to='/manage/editor' />,
      },
    ],
  },
  {
    path: '/manage',
    component: <Layout />,
    routes: [
      {
        path: '/manage/to_home',
        name: '返回首页',
        icon: <RollbackOutlined />,
        component: <Redirect to='/home' />,
      },
      {
        path: '/manage/overview',
        name: '总览',
        icon: <AreaChartOutlined />,
        component: <Result />,
      },
      {
        path: '/manage/blogs',
        name: '文章管理',
        icon: <FileTextOutlined />,
        routes: [
          {
            path: '/manage/blogs/list',
            name: '文章列表',
            icon: <AreaChartOutlined />,
            component: <Result />,
          },
        ],
      },
      {
        path: '/manage/editor',
        name: '新建文章',
        icon: <FileTextOutlined />,
        component: <Editor />,
      },
      {
        path: '/manage/users',
        name: '用户管理',
        icon: <UserOutlined />,
      },
    ],
  },
  {
    path: '/',
    name: '首页',
    component: <Redirect to='/home' />,
  },
]

export default routes
