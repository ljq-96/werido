import { Suspense, useEffect, useMemo, useState } from 'react'
import ProLayout, { DefaultFooter, FooterToolbar } from '@ant-design/pro-layout'
import { Avatar, Button, FloatButton, Popover, Space, theme } from 'antd'
import { Link, Outlet, useNavigate, useLocation, useParams } from 'react-router-dom'
import Logo from '../components/Logo'
import { PageProps } from '../../types'
import Loading from '../components/Loading'
import '../assets/css/index.less'
import { useParseRoute } from '../hooks'
import Weather from './components/Weather'
import LoginUser from './components/LoginUser'
import IconFont from '../components/IconFont'
import Catalog from './components/Catalog'
import TouristFooter from './components/TouristFooter'
import { GithubFilled, LeftOutlined, MenuOutlined, MoreOutlined, RightOutlined } from '@ant-design/icons'
import useStyle from './style'
import BookmarkNav from './components/BookmarkNav'
import { useStore } from '../store'

export default (props: PageProps) => {
  const { route } = props
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const parsedRoutes = useParseRoute(route)
  const { _id, avatar, isDark, getUser, setIsDark, getCatalog, getTags, getArchives } = useStore(state => ({
    isDark: state.isDark,
    setIsDark: state.setIsDark,
    getCatalog: state.getCatalog,
    getTags: state.getTags,
    getArchives: state.getArchives,
    _id: state.user._id,
    avatar: state.user.avatar,
    getUser: state.getUser,
  }))
  const { people } = useParams()
  const style = useStyle()
  const {
    token: { colorPrimary, colorTextDescription, colorBgLayout, colorFillContent },
  } = theme.useToken()

  const isInBlog = useMemo(() => /(^\/blog$)|(^\/blog\/\w{24,24}$)/.test(pathname), [pathname])
  const isInBookmark = useMemo(() => /^\/bookmark$/.test(pathname), [pathname])

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
      siderWidth={isInBlog ? 280 : 180}
      breakpoint='md'
      title={people || 'Werido'}
      logo={people ? <Avatar src={avatar} /> : <Logo style={{ height: 20 }} color={colorPrimary} />}
      layout={'mix'}
      menu={{
        type: 'sub',
        autoClose: false,
        // hideMenuWhenCollapsed: isInBlog,
        defaultOpenAll: true,
        ignoreFlatMenu: true,
      }}
      splitMenus={true}
      route={parsedRoutes}
      menuItemRender={(item, dom) => <Link to={item.redirect || item.path.replace(':people', people)}>{dom}</Link>}
      menuContentRender={
        isInBlog ? () => <Catalog collpased={collapsed} /> : isInBookmark ? () => <BookmarkNav /> : undefined
      }
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
      token={{
        header: {
          colorTextMenuSelected: colorPrimary,
          // colorBgMenuItemSelected: colorFillContent,
        },
      }}
      bgLayoutImgList={[
        {
          src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
          left: 85,
          bottom: 100,
          height: '303px',
        },
        {
          src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
          bottom: -68,
          right: -45,
          height: '303px',
        },
        {
          src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
          bottom: 0,
          left: 0,
          width: '331px',
        },
      ]}
    >
      <Suspense fallback={<Loading />}>{_id && <Outlet />}</Suspense>
      <DefaultFooter
        copyright='京ICP备2022008343号'
        links={
          people &&
          ([
            {
              key: '1',
              href: '/',
              blankTarget: true,
              title: (
                <span>
                  <Logo style={{ width: 16 }} color={colorTextDescription} />
                  <span>Werido</span>
                </span>
              ),
            },
            {
              key: '2',
              href: 'https://github.com/ljq-96/werido',
              blankTarget: true,
              title: (
                <span>
                  <GithubFilled />
                  <span>GitHub</span>
                </span>
              ),
            },
            {},
          ] as any)
        }
      />
    </ProLayout>
  )
}
