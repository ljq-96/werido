import React, { useState, useEffect, useMemo } from 'react'
import { Button, ConfigProvider, Descriptions, Result, Avatar, Space, Layout, Dropdown, Menu } from 'antd'
import { LikeOutlined, UserOutlined, BgColorsOutlined } from '@ant-design/icons'
import * as Icon from '@ant-design/icons'
import { IRouteComponentProps, history, ConnectProps, connect, IStore } from 'umi'
import ProLayout from '@ant-design/pro-layout'
import { User } from '../../interfaces'
import { userApi } from '../api/index'
import Logo from '../components/Logo'
import { BlockPicker } from 'react-color'
import { nameTran } from '../utils/common'
import { ThemeColor } from '../models'
// import 'antd/dist/antd.variable.min.css'
import 'tailwindcss/tailwind.css'

type IProps = IRouteComponentProps &
  ConnectProps & {
    loginUser: User.Result,
    themeColor: { [key in ThemeColor]: string }
  }

const Layouts = (props: IProps) => {
  const { children, location, route, dispatch, loginUser, themeColor } = props
  const [pathname, setPathname] = useState(location.pathname)
  const [collapsed, setCollapsed] = useState(true)
  const themeColorKeys = useMemo(() => Object.values(ThemeColor).map(v => [v, `--ant-${nameTran(v)}`]), [])

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
    const el = getComputedStyle(document.documentElement)
    const color = themeColorKeys.reduce((a, b) => {
      const [key, value] = b
      a[key] = el.getPropertyValue(value).trim()
      return a
    }, {})
    dispatch({
      type: 'store/setThemeColor',
      payload: {
        themeColor: color
      }
    })
  }

  useEffect(() => {
    userApi.getLoginUser().then((res) => {
      if (res.code === 0) {
        dispatch({
          type: 'store/setLoginUser',
          payload: {
            loginUser: res.data
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
          navTheme="light"
          layout="side"
          headerHeight={48}
          fixedHeader={true}
          splitMenus={false}
          onCollapse={setCollapsed}
          collapsed={collapsed}
          breakpoint={false}
          logo={
            <Logo
              style={{ width: 32 }}
              color={[
                themeColor.primary3,
                themeColor.primary4,
                themeColor.primary5,
                themeColor.primary6
              ]}
            />
          }
          // @ts-ignore
          title={<div style={{ transform: 'translate(-12px, 4px)' }}>erido</div>}
          logoStyle={{ color: '#999' }}
          route={{
            path: '/',
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
              <Dropdown
                placement='bottomCenter'
                overlay={
                  <div>
                  <BlockPicker
                    color={themeColor.primaryColor}
                    colors={[
                      '#f5222d',
                      '#fa541c',
                      '#fa8c16',
                      '#faad14',
                      '#fadb14',
                      '#a0d911',
                      '#52c41a',
                      '#13c2c2',
                      '#1890ff',
                      '#2f54eb',
                      '#722ed1',
                      '#eb2f96'
                    ]}
                    onChange={changeColor}
                  />
                  </div>
                }
              >
                <Button type='text' icon={<BgColorsOutlined />} />
              </Dropdown>
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
          </Layout.Content>
        </ProLayout>
      </div>
    </ConfigProvider>
  )
}

export default connect(({ store }: { store: IStore }) => {
  const { loginUser, themeColor } = store
  return { loginUser, themeColor }
})(Layouts)
