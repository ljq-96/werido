import { lazy, useEffect } from 'react'
import {
  HomeOutlined,
  LaptopOutlined,
  RollbackOutlined,
  FileTextOutlined,
  AreaChartOutlined,
  ReadOutlined,
  UserOutlined,
  TagsOutlined,
} from '@ant-design/icons'
import { useNavigate, Outlet } from 'react-router-dom'
import Layout from '../layout'
import { Result } from 'antd'
import { RouteProps } from '../../server/types'

function Redirect({ to }) {
  let navigate = useNavigate()
  useEffect(() => {
    navigate(to, { replace: true })
  })
  return null
}

const routes: RouteProps[] = [
  {
    path: '/login',
    name: '登陆',
    component: lazy(() => import('../pages/Login')),
  },
  {
    path: '/view',
    component: Layout,
    routes: [
      {
        path: '/view/home',
        name: '首页',
        icon: <HomeOutlined />,
        component: lazy(() => import('../pages/View/Home')),
      },
      {
        path: '/view/bookmark',
        name: '收藏夹',
        icon: <TagsOutlined />,
        component: lazy(() => import('../pages/View/Bookmark')),
      },
      {
        path: '/view/blog',
        name: '文章列表',
        icon: <ReadOutlined />,
        component: lazy(() => import('../pages/View/Blog/List')),
      },
      {
        path: '/view/blog/:id',
        name: '文章详情',
        hide: true,
        component: lazy(() => import('../pages/View/Blog/Detail')),
      },
      {
        path: '/view/to_manage',
        name: '管理系统',
        icon: <LaptopOutlined />,
        component: () => <Redirect to='/manage/overview' />,
      },
    ],
  },
  {
    path: '/manage',
    component: Layout,
    routes: [
      {
        path: '/manage/to_home',
        name: '返回首页',
        icon: <RollbackOutlined />,
        component: () => <Redirect to='/view/home' />,
      },
      {
        path: '/manage/overview',
        name: '总览',
        icon: <AreaChartOutlined />,
        component: lazy(() => import('../pages/Manage/Overview')),
      },
      {
        path: '/manage/blog',
        name: '文章管理',
        icon: <FileTextOutlined />,
        component: lazy(() => import('../pages/Manage/Blog/List')),
      },
      {
        path: '/manage/blog/editor',
        name: '新建文章',
        hide: true,
        component: lazy(() => import('../pages/Manage/Blog/Editor')),
      },
      {
        path: '/manage/users',
        name: '用户管理',
        icon: <UserOutlined />,
        component: lazy(() => import('../pages/Manage/User')),
      },
    ],
  },
  {
    path: '/',
    name: '首页',
    component: () => <Redirect to='/view/home' />,
  },
]

export default routes
