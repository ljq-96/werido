import { Suspense, useEffect, useMemo, useState } from 'react'
import ProLayout, { DefaultFooter, PageContainer } from '@ant-design/pro-layout'
import { LogoutOutlined, RightOutlined, SettingFilled, UserOutlined } from '@ant-design/icons'
import { ConfigProvider, Space, Button, Drawer, Card, message } from 'antd'
import { Link, Outlet, useNavigate, useLocation, useMatch } from 'react-router-dom'
import Logo from '../components/Logo'
import { useUser } from '../contexts/useUser'
import { request } from '../api'
import { CirclePicker, MaterialPicker, SliderPicker } from 'react-color'
import { basicUserView } from '../contexts/useUser/actions'
import { PageProps, RouteProps } from '../../types'
import Loading from '../components/Loading'
import * as colors from '@ant-design/colors'
import './style.less'
import '../assets/css/index.less'
import { useParseRoute } from '../hooks'

export default (props: PageProps) => {
  const { route } = props
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [showColorDrawer, setShowColorDrawer] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loginUser, { dispatch, getUser }] = useUser()
  const currentRoutes = useParseRoute(route)

  const getMyProfile = () => {
    setLoading(true)
    getUser()
      .then(res => ConfigProvider.config({ theme: { primaryColor: res.themeColor } }))
      .finally(() => {
        setLoading(false)
      })
  }

  const logout = () => {
    request.logout({ method: 'POST' }).then(res => {
      navigate('/login')
      message.success('已退出')
      dispatch(basicUserView.destroy.actions())
    })
  }

  const changeColor = ({ hex }) => {
    ConfigProvider.config({
      theme: {
        primaryColor: hex,
      },
    })
    dispatch(basicUserView.update.actions({ themeColor: hex }))
  }

  const handleDrawer = () => {
    setShowColorDrawer(!showColorDrawer)
    if (showColorDrawer) {
      const { themeColor, layoutB, layoutC } = loginUser
      request.myProfile({ method: 'PUT', data: { themeColor, layoutB, layoutC } })
    }
  }

  useEffect(getMyProfile, [])

  return (
    <ProLayout
      loading={loading}
      className='layout'
      fixedHeader={true}
      siderWidth={180}
      breakpoint='lg'
      title='Werido'
      logo={<Logo style={{ width: 32 }} color={loginUser?.themeColor} />}
      layout={'mix'}
      menu={{ type: 'group' }}
      splitMenus={true}
      route={currentRoutes}
      menuItemRender={(item, dom) => <Link to={item.path}>{dom}</Link>}
      location={{ pathname }}
      onMenuHeaderClick={() => navigate('/')}
      avatarProps={{
        src: loginUser?.avatar,
        title: loginUser?.username,
      }}
      actionsRender={({}) => {
        return [
          <SettingFilled onClick={() => setShowColorDrawer(!showColorDrawer)} />,
          <LogoutOutlined onClick={logout} />,
        ]
      }}
    >
      <Suspense fallback={<Loading />}>
        {loginUser && <Outlet />}
        <DefaultFooter style={{ background: 'transparent' }} copyright='京ICP备2022008343号' />
      </Suspense>
      <Drawer
        className='color-drawer'
        open={showColorDrawer}
        width={300}
        mask={false}
        onClose={handleDrawer}
        closeIcon={null}
        style={{ top: 56, zIndex: 18 }}
        zIndex={1000}
        footer={
          <Space>
            <Button
              style={{ background: 'rgba(255, 255, 255, 0.4)' }}
              onClick={() => {
                setShowColorDrawer(false)
                getMyProfile()
              }}
            >
              取消
            </Button>
            <Button onClick={handleDrawer} type='primary'>
              应用
            </Button>
          </Space>
        }
      >
        <CirclePicker
          colors={[
            colors.red.primary,
            colors.volcano.primary,
            colors.orange.primary,
            colors.gold.primary,
            colors.yellow.primary,
            colors.lime.primary,
            colors.green.primary,
            colors.cyan.primary,
            colors.blue.primary,
            colors.geekblue.primary,
            colors.purple.primary,
            colors.magenta.primary,
          ]}
          color={loginUser?.themeColor}
          onChange={changeColor}
        />
        <div style={{ margin: '24px 0' }}>
          <SliderPicker color={loginUser?.themeColor} onChange={changeColor} />
        </div>
        <Card size='small'>
          <div className='overflow-hidden'>
            <div style={{ margin: '0 -1px' }}>
              <MaterialPicker color={loginUser?.themeColor} onChange={changeColor} />
            </div>
          </div>
        </Card>
      </Drawer>
    </ProLayout>
  )
}
