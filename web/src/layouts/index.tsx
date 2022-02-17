import React, { useState, useEffect } from 'react'
import { Button, Descriptions, Result, Avatar, Space, Layout } from 'antd'
import { LikeOutlined, UserOutlined } from '@ant-design/icons'
import * as Icon from '@ant-design/icons'
import { IRouteComponentProps, history, ConnectProps, connect, IStore } from 'umi'
import ProLayout from '@ant-design/pro-layout'
import { User } from '../../../interfaces'
import { userApi } from '../api/index'

type IProps = IRouteComponentProps &
  ConnectProps & {
    loginUser: User.Result
  }

const Layouts = (props: IProps) => {
  const { children, location, route, dispatch, loginUser } = props
  const [pathname, setPathname] = useState('/home')
  const [collapsed, setCollapsed] = useState(true)

  const loopMenuItem = (menus) =>
    menus.map(({ icon, routes, title, ...item }) => ({
      ...item,
      icon: Icon[icon]?.render(),
      name: title,
      routes: routes ? loopMenuItem(routes) : []
    }))

    useEffect(() => {
      userApi.getLoginUser().then((res) => {
        if (res.code === 0) {
          dispatch({
            type: 'store/setLoginUser',
            payload: res.data
          })
        } else {
          history.push('/login')
        }
      })
    }, [])

  return (
    <div id="test-pro-layout" style={{ height: '100vh' }}>
      <ProLayout
        disableContentMargin
        fixSiderbar={true}
        navTheme="light"
        layout="side"
        headerHeight={48}
        primaryColor="#1890ff"
        fixedHeader={true}
        splitMenus={false}
        onCollapse={setCollapsed}
        collapsed={collapsed}
        breakpoint={false}
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
          <Button type='text'>
            <Avatar shape="square" size="small" icon={<UserOutlined />} style={{ marginRight: 10 }} />
            {loginUser?.username}
          </Button>
        )}
      >
        <Layout.Content style={{ position: 'relative', height: 'calc(100vh - 48px)', padding: 16, overflowY: 'auto', overflowX: 'hidden' }}>
          {children}
        </Layout.Content>
      </ProLayout>
    </div>
  )
}

export default connect(({ store }: { store: IStore }) => {
  const { loginUser } = store
  return { loginUser }
})(Layouts)
