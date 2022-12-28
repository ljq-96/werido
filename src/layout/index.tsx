import { Suspense, useEffect, useState } from 'react'
import ProLayout, { DefaultFooter, PageContainer } from '@ant-design/pro-layout'
import { ConfigProvider, Space } from 'antd'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import Logo from '../components/Logo'
import { useUser } from '../contexts/useUser'
import { PageProps } from '../../types'
import Loading from '../components/Loading'
import './style.less'
import '../assets/css/index.less'
import { useParseRoute } from '../hooks'
import Weather from './components/Weather'
import LoginUser from './components/LoginUser'

export default (props: PageProps) => {
  const { route } = props
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [loginUser, { getUser }] = useUser()
  const currentRoutes = useParseRoute(route)

  const getMyProfile = () => {
    setLoading(true)
    getUser()
      .then(res => ConfigProvider.config({ theme: { primaryColor: res.themeColor } }))
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(getMyProfile, [])

  return (
    <ProLayout
      loading={loading}
      token={{ colorPrimary: loginUser?.themeColor, header: { colorTextMenuSelected: '#000' } }}
      className='layout'
      fixedHeader={true}
      siderWidth={180}
      breakpoint='lg'
      title='Werido'
      logo={<Logo style={{ width: 32 }} color={loginUser?.themeColor} />}
      layout={'mix'}
      menu={{ type: 'sub', ignoreFlatMenu: true }}
      splitMenus={true}
      route={currentRoutes}
      menuItemRender={(item, dom) => <Link to={item.redirect || item.path}>{dom}</Link>}
      onMenuHeaderClick={() => navigate('/')}
      avatarProps={{
        src: loginUser?.avatar,
        title: loginUser?.username,
        children: loginUser?.username?.[0],
      }}
      rightContentRender={() => (
        <Space align='center'>
          <Weather />
          <LoginUser />
        </Space>
      )}
    >
      <ConfigProvider theme={loginUser?.themeColor ? { token: { colorPrimary: loginUser.themeColor } } : {}}>
        <Suspense fallback={<Loading />}>
          {loginUser && <Outlet />}
          <DefaultFooter style={{ background: 'transparent' }} copyright='京ICP备2022008343号' />
        </Suspense>
      </ConfigProvider>
    </ProLayout>
  )
}
