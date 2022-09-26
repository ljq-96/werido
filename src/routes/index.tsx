import { lazy, useEffect } from 'react'
import {
  HomeOutlined,
  LaptopOutlined,
  RollbackOutlined,
  FileTextOutlined,
  AreaChartOutlined,
  ReadOutlined,
  UserOutlined,
  TeamOutlined,
  TagOutlined,
  TagsOutlined,
} from '@ant-design/icons'
import { useNavigate, Outlet } from 'react-router-dom'
import Layout from '../layout'
import { RouteProps } from '../../types'
import UserCenterBlogList from '../pages/UserCenter/Blog/List'
import UserCenterBlogCatalog from '../pages/UserCenter/Blog/Catalog'
import UserCenterOverview from '../pages/UserCenter/Overview'
import UserCenterDetail from '../pages/UserCenter/Detail'

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
    path: '/',
    component: Layout,
    routes: [
      {
        path: '/home',
        name: '首页',
        icon: <HomeOutlined />,
        component: lazy(() => import('../pages/Home')),
      },
      {
        path: '/bookmark',
        name: '书签',
        icon: <TagOutlined />,
        component: lazy(() => import('../pages/Bookmark')),
      },
      {
        path: '/blog',
        name: '知识库',
        icon: <ReadOutlined />,
        component: lazy(() => import('../pages/Blog/List')),
      },
      {
        path: '/blog/:id',
        name: '文章详情',
        hide: true,
        component: lazy(() => import('../pages/Blog/Detail')),
      },
      {
        path: '/blog/editor',
        name: '新建文章',
        hide: true,
        component: lazy(() => import('../pages/Blog/Editor')),
      },
      {
        path: '/user_center',
        name: '用户中心',
        icon: <UserOutlined />,
        component: lazy(() => import('../pages/UserCenter')),
        routes: [
          {
            path: '/user_center',
            name: '统计',
            component: UserCenterOverview,
            icon: <AreaChartOutlined />,
            hide: true,
          },
          {
            path: '/user_center/bookmark',
            name: '我的书签',
            component: UserCenterBlogList,
            icon: <TagsOutlined />,
            hide: true,
          },
          {
            path: '/user_center/blog',
            name: '我的知识库',
            component: Outlet,
            icon: <ReadOutlined />,
            hide: true,
            routes: [
              {
                path: '/user_center/blog/list',
                name: '列表',
                component: UserCenterBlogList,
              },
              {
                path: '/user_center/blog/catalog',
                name: '目录',
                component: UserCenterBlogCatalog,
              },
            ],
          },
          {
            path: '/user_center/detail',
            name: '我的账号',
            component: UserCenterDetail,
            icon: <UserOutlined />,
            hide: true,
          },
        ],
      },
      {
        path: '/to_manage',
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
        component: () => <Redirect to='/home' />,
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
        icon: <TeamOutlined />,
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
