import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import ProLayout, { DefaultFooter, PageContainer, RouteContext } from '@ant-design/pro-layout'
import { Button, Card, ConfigProvider, Row, Space, theme } from 'antd'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import Logo from '../components/Logo'
import { useUser } from '../contexts/useUser'
import { ICatalog, PageProps } from '../../types'
import Loading from '../components/Loading'
import './style.less'
import '../assets/css/index.less'
import { useParseRoute } from '../hooks'
import Weather from './components/Weather'
import LoginUser from './components/LoginUser'
import { SettingOutlined } from '@ant-design/icons'
import { useStore } from '../contexts/useStore'
import { IconFont } from '../utils/common'
import Catalog from '../components/Catalog'
import CatalogIcon from '../components/CatalogIcon'

export default (props: PageProps) => {
  const { route } = props
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { pathname } = useLocation()
  const [{ _id, avatar, username }, { getUser }] = useUser()
  const parsedRoutes = useParseRoute(route)
  const [{ isDark }, { setIsDark }] = useStore()
  const {
    token: { colorPrimary, colorPrimaryBg },
  } = theme.useToken()

  const isInBlog = useMemo(() => /(^\/blog$)|(^\/blog\/\w{24,24}$)/.test(pathname), [pathname])

  const getMyProfile = () => {
    setLoading(true)
    getUser().finally(() => {
      setLoading(false)
    })
  }

  useEffect(() => {
    getMyProfile()
  }, [])

  return (
    <ProLayout
      loading={loading}
      className='layout'
      fixedHeader={true}
      siderWidth={isInBlog ? 240 : 180}
      breakpoint='lg'
      title='Werido'
      logo={<Logo style={{ width: 32 }} color={colorPrimary} />}
      layout={'mix'}
      menu={{
        type: 'sub',
        autoClose: false,
        hideMenuWhenCollapsed: isInBlog,
        defaultOpenAll: true,
        ignoreFlatMenu: true,
      }}
      splitMenus={true}
      route={parsedRoutes}
      menuItemRender={(item, dom) => <Link to={item.redirect || item.path}>{dom}</Link>}
      menuContentRender={isInBlog ? () => <Catalog /> : undefined}
      onMenuHeaderClick={() => navigate('/')}
      // avatarProps={{
      //   src: avatar,
      //   title: username,
      //   children: username?.[0],
      // }}
      actionsRender={() => [
        <IconFont onClick={() => setIsDark(!isDark)} type={isDark ? 'icon-sun' : 'icon-moon'} />,
        <Weather />,
        <LoginUser />,
      ]}
      // rightContentRender={() => (
      //   <Space align='center'>
      //     <Weather />
      //     <LoginUser />
      //   </Space>
      // )}
    >
      <Suspense fallback={<Loading />}>
        {_id && <Outlet />}
        <DefaultFooter style={{ background: 'transparent' }} copyright='京ICP备2022008343号' />
      </Suspense>
    </ProLayout>
  )
}
