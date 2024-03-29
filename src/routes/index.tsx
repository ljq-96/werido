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
import { UserStatus } from '../../types/enum'

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
        name: '收藏夹',
        icon: <TagOutlined />,
        component: Outlet,
        routes: [
          {
            path: '/',
            name: '收藏夹',
            component: lazy(() => import('../pages/Bookmark')),
          },
        ],
      },
      {
        path: '/blog',
        name: '知识库',
        icon: <ReadOutlined />,
        component: Outlet,
        routes: [
          {
            path: '/',
            name: '知识库',
            component: lazy(() => import('../pages/Blog/List')),
          },
          {
            path: '/:id',
            name: '文章详情',
            component: lazy(() => import('../pages/Blog/Detail')),
          },
        ],
      },
      {
        path: '/editor',
        name: '新建文章',
        hide: true,
        component: lazy(() => import('../pages/Blog/Editor')),
      },
      // {
      //   path: '/user_center',
      //   name: '用户中心',
      //   icon: <UserOutlined />,
      //   redirect: '/user_center/dashboard',
      //   component: lazy(() => import('../pages/UserCenter')),
      //   routes: [
      //     {
      //       path: 'dashboard',
      //       name: '数据统计',
      //       component: UserCenterOverview,
      //       icon: <AreaChartOutlined />,
      //     },
      //     {
      //       path: 'blog',
      //       name: '我的知识库',
      //       component: Outlet,
      //       icon: <ReadOutlined />,
      //       routes: [
      //         {
      //           path: 'list',
      //           name: '文章列表',
      //           icon: <TableOutlined />,
      //           component: UserCenterBlogList,
      //         },
      //         {
      //           path: 'catalog',
      //           name: '文章目录',
      //           icon: <UnorderedListOutlined />,
      //           component: UserCenterBlogCatalog,
      //         },
      //       ],
      //     },
      //     {
      //       path: 'bookmark',
      //       name: '我的书签',
      //       component: UserCenterBlogList,
      //       icon: <TagsOutlined />,
      //     },
      //     {
      //       path: 'detail',
      //       name: '我的账号',
      //       component: UserCenterDetail,
      //       icon: <UserOutlined />,
      //     },
      //   ],
      // },
      {
        path: '/manage',
        component: Outlet,
        name: '后台管理',
        redirect: '/manage/dashboard',
        icon: <LaptopOutlined />,
        auth: [UserStatus.管理员],
        routes: [
          {
            path: 'dashboard',
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
  {
    path: '/user/:people',
    name: '博客',
    component: Layout,
    routes: [
      {
        path: '/blog/*',
        name: '主页',
        component: lazy(() => import('../pages/Tourist/Blog')),
      },
      {
        path: '/archives/*',
        name: '归档',
        component: lazy(() => import('../pages/Tourist/Archives')),
      },
      {
        path: '/tags/*',
        name: '标签',
        component: lazy(() => import('../pages/Tourist/Tags')),
      },
      {
        path: '/about',
        name: '关于',
        component: lazy(() => import('../pages/Tourist/About')),
      },
    ],
  },
]

export default routes
