import React, { useState, useEffect, useMemo } from 'react'
import { Button, ConfigProvider, Descriptions, Result, Avatar, Space, Layout, Dropdown, Menu, Drawer, Form, Segmented, Card } from 'antd'
import { LikeOutlined, UserOutlined, BgColorsOutlined } from '@ant-design/icons'
import { generate } from '@ant-design/colors'
import * as Icon from '@ant-design/icons'
import { IRouteComponentProps, history, ConnectProps, connect, IStore } from 'umi'
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout'
import { User } from '../../interfaces'
import { userApi } from '../api/index'
import Logo from '../components/Logo'
import { BlockPicker, CirclePicker, MaterialPicker, SliderPicker  } from 'react-color'
import 'tailwindcss/tailwind.css'

type IProps = IRouteComponentProps &
  ConnectProps & {
    loginUser: User.Result,
  }

const Layouts = (props: IProps) => {
  const { children, location, route, dispatch, loginUser } = props
  const [pathname, setPathname] = useState(location.pathname)
  const [collapsed, setCollapsed] = useState(true)
  const [showColorDrawer, setShowColorDrawer] = useState(false)

  const logout = () => {
    userApi.logout()
  }

  const loopMenuItem = (menus) =>
    menus.map(({ icon, routes, title, ...item }) => ({
      ...item,
      icon: Icon[icon]?.render(),
      name: title,
      routes: routes ? loopMenuItem(routes) : []
    }))
  
  const changeColor = ({ hex }) => {
    ConfigProvider.config({
      theme: {
        primaryColor: hex
      }
    })
    userApi.updateUser({ _id: loginUser._id, themeColor: hex })
    
    dispatch({
      type: 'store/setLoginUser',
      payload: {
        loginUser: {
          ...loginUser,
          themeColor: hex
        }
      }
    })
  }

  useEffect(() => {
    userApi.getLoginUser().then((res) => {
      if (res.code === 0) {
        res.data.themeColor = res.data.themeColor || '#1890ff'
        dispatch({
          type: 'store/setLoginUser',
          payload: {
            loginUser: res.data
          }
        })
        ConfigProvider.config({
          theme: {
            primaryColor: res.data.themeColor
          }
        })
      } else {
        history.push('/login')
      }
    })
  }, [])

  return (
    <ConfigProvider>
      <div id="test-pro-layout" style={{ height: '100vh' }}>
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
          logo={
            <Logo
              style={{ width: 32 }}
              color={generate(loginUser?.themeColor || '#1890ff').slice(3, 7)}
            />
          }
          title='werido'
          logoStyle={{ color: '#999' }}
          route={{
            routes: loopMenuItem(route.routes)
          }}
          location={{
            pathname
          }}            
          menuItemRender={(item, dom) => (
            <a
              onClick={() => {
                setPathname(item.path)
                history.push(item.path)
              }}
            >
              {dom}
            </a>
          )}
          rightContentRender={() => (
            <Space>
              <Button type='text' icon={<BgColorsOutlined />} onClick={() => setShowColorDrawer(!showColorDrawer)} />
              <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item onClick={logout}>退出</Menu.Item>
                    </Menu>
                  }
                >
                  <Button type="text">
                    <Avatar shape="square" size="small" icon={<UserOutlined />} style={{ marginRight: 10 }} />
                    {loginUser?.username}
                  </Button>
                </Dropdown>
            </Space>
          )}
        >
          <Layout.Content style={{ position: 'relative', height: 'calc(100vh - 48px)', padding: 16, overflowY: 'auto', overflowX: 'hidden' }}>
            {loginUser && children}
            <DefaultFooter style={{ background: 'transparent' }} copyright="京ICP备2022008343号" />
            <Drawer
              visible={showColorDrawer}
              getContainer={false}
              width={300}
              mask={false}
              onClose={() => setShowColorDrawer(false)}
              style={{ top: 48, zIndex: 18 }}
            >
              <Form layout='vertical'>
              <Form.Item label='主题色'>
                <CirclePicker color={loginUser?.themeColor} onChange={changeColor} />
                <div style={{ margin: '24px 0' }}>
                  <SliderPicker color={loginUser?.themeColor} onChange={changeColor} />
                </div>
                <Card size='small' hoverable>
                  <div className='overflow-hidden'>
                    <div style={{ margin: '0 -1px' }}><MaterialPicker color={loginUser?.themeColor} onChange={changeColor} /></div>
                  </div>
                </Card>
              </Form.Item>
              
              <Form.Item label='布局模式'>
              <Segmented options={[
                {
                  label: '侧栏',
                  value: 'side'
                },
                {
                  label: '顶栏',
                  value: 'top'
                }
              ]}>

              </Segmented>
              </Form.Item>
              </Form>
              
              
            </Drawer>
          </Layout.Content>
          
        </ProLayout>
      </div>
    </ConfigProvider>
  )
}

export default connect(({ store }: { store: IStore }) => {
  const { loginUser } = store
  return { loginUser }
})(Layouts)
