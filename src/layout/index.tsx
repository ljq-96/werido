import { useEffect, useMemo, useState } from 'react'
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout'
import { BgColorsOutlined, UserOutlined } from '@ant-design/icons'
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
import { userApi } from '../api'
import { CirclePicker, MaterialPicker, SliderPicker } from 'react-color'
import '../assets/css/index.less'

// import 'antd/dist/antd.variable.min.css'

export default () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(true)
  const [showColorDrawer, setShowColorDrawer] = useState(false)
  const [loginUser, userDispatch] = useUser()

  const currentRoutes = useMemo(() => routes.find((item) => pathname.startsWith(item.path)), [pathname])

  const logout = () => {
    userApi.logout().then((res) => {
      if (res.code === 0) {
        navigate('/login')
        message.success(res.msg)
        userDispatch({ type: 'destory' })
      }
    })
  }

  const changeColor = ({ hex }) => {
    ConfigProvider.config({
      theme: {
        primaryColor: hex,
      },
    })

    userDispatch({
      type: 'update',
      payload: {
        ...loginUser,
        themeColor: hex,
      },
    })
  }

  const handleCloseDrawer = () => {
    setShowColorDrawer(false)
    const { themeColor, _id } = loginUser
    userApi.updateUser(_id, { themeColor })
  }

  useEffect(() => {
    userApi.getLoginUser().then((res) => {
      if (res.code === 0) {
        userDispatch({ type: 'update', payload: res.data })
        ConfigProvider.config({
          theme: {
            primaryColor: res.data.themeColor,
          },
        })
      } else {
        navigate('/login')
      }
    })
  }, [])

  return (
    <ProLayout
      disableContentMargin
      fixSiderbar={true}
      navTheme='light'
      layout='side'
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
          <Button type='text' icon={<BgColorsOutlined />} onClick={() => setShowColorDrawer(!showColorDrawer)} />
          <Dropdown
            overlay={
              <Menu>
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
          onClose={handleCloseDrawer}
          style={{ top: 48, zIndex: 18 }}>
          <Form layout='vertical'>
            <Form.Item label='主题色'>
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
            </Form.Item>

            <Form.Item label='布局模式'>
              <Segmented
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
            </Form.Item>
          </Form>
        </Drawer>
      </Layout.Content>
    </ProLayout>
  )
}
