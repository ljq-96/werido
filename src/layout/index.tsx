import { useEffect, useMemo, useState } from 'react'
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout'
import { BgColorsOutlined, SettingFilled, UserOutlined } from '@ant-design/icons'
import {
  ConfigProvider,
  Menu,
  Layout,
  Space,
  Button,
  Avatar,
  Dropdown,
  Drawer,
  Form,
  Segmented,
  Card,
  message,
} from 'antd'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import Logo from '../components/Logo'
import routes from '../routes'
import { useUser } from '../contexts/useUser'
import { basicApi, myProfile } from '../api'
import { CirclePicker, MaterialPicker, SliderPicker } from 'react-color'
import { basicUserView } from '../contexts/useUser/actions'
import '../assets/css/index.less'

export default () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(true)
  const [showColorDrawer, setShowColorDrawer] = useState(false)
  const [loginUser, userDispatch] = useUser()

  const currentRoutes = useMemo(() => routes.find((item) => pathname.startsWith(item.path)), [pathname])

  const currentLayout = useMemo(
    () => (currentRoutes.path === '/home' ? loginUser.layoutC : loginUser.layoutB),
    [currentRoutes, loginUser],
  )

  const getMyProfile = () => {
    myProfile.get().then((res) => {
      if (res.code === 0) {
        userDispatch(basicUserView.update.actions(res.data))
        ConfigProvider.config({
          theme: {
            primaryColor: res.data.themeColor,
          },
        })
      }
    })
  }

  const logout = () => {
    basicApi.logout().then((res) => {
      if (res.code === 0) {
        navigate('/login')
        message.success(res.msg)
        userDispatch(basicUserView.destroy.actions())
      }
    })
  }

  const changeColor = ({ hex }) => {
    ConfigProvider.config({
      theme: {
        primaryColor: hex,
      },
    })
    userDispatch(basicUserView.update.actions({ themeColor: hex }))
  }

  const handleDrawer = () => {
    setShowColorDrawer(!showColorDrawer)
    if (showColorDrawer) {
      const { themeColor, layoutB, layoutC } = loginUser
      myProfile.put({ themeColor, layoutB, layoutC })
    }
  }

  useEffect(getMyProfile, [])

  return (
    <ProLayout
      disableContentMargin
      fixSiderbar={true}
      navTheme='light'
      layout={currentLayout}
      contentWidth='fixed'
      headerHeight={48}
      fixedHeader={true}
      splitMenus={false}
      onCollapse={setCollapsed}
      collapsed={collapsed}
      breakpoint={false}
      title={<div style={{ color: '#4a4a4a' }}>werido</div>}
      logo={<Logo style={{ width: 32 }} color={loginUser?.themeColor} />}
      route={currentRoutes}
      menuItemRender={(item, dom) => <Link to={item.path}>{dom}</Link>}
      location={{
        pathname: pathname,
      }}
      logoStyle={{ color: '#999' }}
      rightContentRender={() => (
        <Space>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item>个人中心</Menu.Item>
                <Menu.Item onClick={() => setShowColorDrawer(true)}>系统设置</Menu.Item>
                <Menu.Divider />
                <Menu.Item onClick={logout}>退出</Menu.Item>
              </Menu>
            }>
            <Button type='text'>
              <Avatar shape='square' size='small' icon={<UserOutlined />} style={{ marginRight: 10 }} />
              {loginUser?.username}
            </Button>
          </Dropdown>
        </Space>
      )}>
      <Layout.Content
        style={{
          position: 'relative',
          height: 'calc(100vh - 48px)',
          padding: 16,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}>
        {loginUser?._id && <Outlet />}
        <DefaultFooter style={{ background: 'transparent' }} copyright='京ICP备2022008343号' />
        <Drawer
          visible={showColorDrawer}
          getContainer={false}
          width={300}
          mask={false}
          onClose={handleDrawer}
          closeIcon={false}
          style={{ top: 48, zIndex: 18 }}>
          <CirclePicker color={loginUser?.themeColor} onChange={changeColor} />
          <div style={{ margin: '24px 0' }}>
            <SliderPicker color={loginUser?.themeColor} onChange={changeColor} />
          </div>
          <Card size='small' hoverable>
            <div className='overflow-hidden'>
              <div style={{ margin: '0 -1px' }}>
                <MaterialPicker color={loginUser?.themeColor} onChange={changeColor} />
              </div>
            </div>
          </Card>

          <div style={{ marginBottom: 8 }}>
            前台系统：
            <Segmented
              value={loginUser.layoutC}
              onChange={(e: any) => userDispatch(basicUserView.update.actions({ layoutC: e }))}
              options={[
                {
                  label: '侧栏',
                  value: 'side',
                },
                {
                  label: '顶栏',
                  value: 'top',
                },
              ]}></Segmented>
          </div>
          <div>
            后台管理：
            <Segmented
              value={loginUser.layoutB}
              onChange={(e: any) => userDispatch(basicUserView.update.actions({ layoutB: e }))}
              options={[
                {
                  label: '侧栏',
                  value: 'side',
                },
                {
                  label: '顶栏',
                  value: 'top',
                },
              ]}></Segmented>
          </div>

          <Space style={{ marginTop: 24 }}>
            <Button
              onClick={() => {
                setShowColorDrawer(false)
                getMyProfile()
              }}>
              取消
            </Button>
            <Button onClick={handleDrawer} type='primary'>
              应用
            </Button>
          </Space>
        </Drawer>
      </Layout.Content>
    </ProLayout>
  )
}
