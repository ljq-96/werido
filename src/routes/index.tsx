import { lazy } from 'react'
import {
  HomeOutlined,
  LaptopOutlined,
  FileTextOutlined,
  AreaChartOutlined,
  ReadOutlined,
  UserOutlined,
  TeamOutlined,
  TagOutlined,
  TagsOutlined,
  CalendarOutlined,
  UnorderedListOutlined,
  TableOutlined,
} from '@ant-design/icons'
import { Outlet } from 'react-router-dom'
import Layout from '../layout'
import { RouteProps } from '../../types'
import UserCenterBlogList from '../pages/UserCenter/Blog/List'
import UserCenterBlogCatalog from '../pages/UserCenter/Blog/Catalog'
import UserCenterOverview from '../pages/UserCenter/Overview'
import UserCenterDetail from '../pages/UserCenter/Detail'

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
        path: '/',
        name: '工作台',
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
            path: '',
            name: '数据统计',
            component: UserCenterOverview,
            icon: <AreaChartOutlined />,
          },
          {
            path: 'blog',
            name: '我的知识库',
            component: Outlet,
            icon: <ReadOutlined />,
            routes: [
              {
                path: 'list',
                name: '文章列表',
                icon: <TableOutlined />,
                component: UserCenterBlogList,
              },
              {
                path: 'catalog',
                name: '文章目录',
                icon: <UnorderedListOutlined />,
                component: UserCenterBlogCatalog,
              },
            ],
          },
          {
            path: 'bookmark',
            name: '我的书签',
            component: UserCenterBlogList,
            icon: <TagsOutlined />,
          },
          {
            path: 'detail',
            name: '我的账号',
            component: UserCenterDetail,
            icon: <UserOutlined />,
          },
        ],
      },
      {
        path: '/manage',
        component: Outlet,
        name: '后台管理',
        icon: <LaptopOutlined />,
        routes: [
          {
            path: '',
            name: '数据统计',
            icon: <AreaChartOutlined />,
            component: lazy(() => import('../pages/Manage/Overview')),
          },
          {
            path: 'blog',
            name: '文章管理',
            icon: <FileTextOutlined />,
            component: lazy(() => import('../pages/Manage/Blog/List')),
          },
          {
            path: 'blog/editor',
            name: '新建文章',
            hide: true,
            component: lazy(() => import('../pages/Manage/Blog/Editor')),
          },
          {
            path: 'bookmark',
            name: '书签管理',
            icon: <TagsOutlined />,
            component: lazy(() => import('../pages/Manage/Bookmark')),
          },
          {
            path: 'todo',
            name: '日程管理',
            icon: <CalendarOutlined />,
            component: lazy(() => import('../pages/Manage/Todo')),
          },
          {
            path: 'users',
            name: '用户管理',
            icon: <TeamOutlined />,
            component: lazy(() => import('../pages/Manage/User')),
          },
        ],
      },
    ],
  },
]

export default routes
