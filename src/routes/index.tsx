import { lazy, useEffect } from 'react'
import { HomeOutlined, LaptopOutlined, RollbackOutlined, FileTextOutlined } from '@ant-design/icons'
import { useNavigate, Navigator } from 'react-router-dom'
import Layout from '../layout'

const Login = lazy(() => import('../pages/Login'))
const Home = lazy(() => import('../pages/Home'))
const Editor = lazy(() => import('../pages/Editor'))

function Redirect({ to }) {
  let navigate = useNavigate();
  useEffect(() => {
    navigate(to);
  });
  return null;
}

const routes = [
  {
    path: '/login',
    name: '登陆',
    component: <Login />,
  },
  {
    path: '/home',
    component: <Layout />,
    routes: [
      {
        path: '/home',
        name: '首页',
        icon: <HomeOutlined />,
        component: <Home />,
      },
      {
        path: '/home/to_manage',
        name: '管理系统',
        icon: <LaptopOutlined />,
        component: <Redirect to='/manage/editor' />
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
        component: <Redirect to='/home' />
      },
      {
        path: '/manage/editor',
        name: '新建文章',
        icon: <FileTextOutlined />,
        component: <Editor />
      }
    ]
  },
  {
    path: '/',
    name: '首页',
    component: <Redirect to='/home' />,
  }
]

export default routes
