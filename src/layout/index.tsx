import { Suspense, useEffect, useMemo, useState } from 'react'
import ProLayout, { DefaultFooter, FooterToolbar } from '@ant-design/pro-layout'
import { Avatar, Button, FloatButton, theme } from 'antd'
import { Link, Outlet, useNavigate, useLocation, useParams } from 'react-router-dom'
import Logo from '../components/Logo'
import { useUser } from '../contexts/useUser'
import { PageProps } from '../../types'
import Loading from '../components/Loading'
import '../assets/css/index.less'
import { useParseRoute } from '../hooks'
import Weather from './components/Weather'
import LoginUser from './components/LoginUser'
import { useStore } from '../contexts/useStore'
import { IconFont } from '../utils/common'
import Catalog from './components/Catalog'
import TouristFooter from './components/TouristFooter'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import useStyle from './style'

export default (props: PageProps) => {
  const { route } = props
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [{ _id, avatar }, { getUser }] = useUser()
  const parsedRoutes = useParseRoute(route)
  const [{ isDark }, { setIsDark, getCatalog, getTags, getArchives }] = useStore()
  const { people } = useParams()
  const style = useStyle()
  const {
    token: { colorPrimary },
  } = theme.useToken()

  const isInBlog = useMemo(() => /(^\/blog$)|(^\/blog\/\w{24,24}$)/.test(pathname), [pathname])

  const getMyProfile = () => {
    setLoading(true)
    getUser(people)
      .then(() => {
        getCatalog(people)
        getTags(people)
        getArchives(people)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getMyProfile()
  }, [people])

  return (
    <ProLayout
      css={style}
      loading={loading}
      className='layout'
      fixedHeader={true}
      collapsed={collapsed}
      siderWidth={isInBlog ? 240 : 180}
      breakpoint='md'
      title={people || 'Werido'}
      logo={people ? <Avatar src={avatar} /> : <Logo style={{ width: 32 }} color={colorPrimary} />}
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
      menuItemRender={(item, dom) => <Link to={item.redirect || item.path.replace(':people', people)}>{dom}</Link>}
      menuContentRender={isInBlog ? () => <Catalog /> : undefined}
      onMenuHeaderClick={() => navigate('/')}
      actionsRender={() => [
        <IconFont onClick={() => setIsDark(!isDark)} type={isDark ? 'icon-sun' : 'icon-moon'} />,
        !people && <Weather />,
        !people && <LoginUser />,
      ]}
      collapsedButtonRender={collapsed => (
        <div className='collapsed-btn' onClick={() => setCollapsed(!collapsed)}>
          <div className={`icon ${collapsed ? 'collapsed' : ''}`}>{<LeftOutlined />}</div>
        </div>
      )}
    >
      <Suspense fallback={<Loading />}>{_id && <Outlet />}</Suspense>
      {people ? <TouristFooter /> : <DefaultFooter copyright='京ICP备2022008343号' />}
    </ProLayout>
  )
}
