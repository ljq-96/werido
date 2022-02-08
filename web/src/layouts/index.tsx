import React, { useState } from 'react'
import { Layout, Menu, Breadcrumb } from 'antd'
import { IRouteComponentProps } from 'umi'
import * as Icon from '@ant-design/icons'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'

const { Header, Content, Footer, Sider } = Layout
const { SubMenu } = Menu

export default function Layouts(props: IRouteComponentProps) {
  const { children, location, route, history, match } = props
  const [collapsed, setCollapsed] = useState(false)
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        theme='light'
        collapsedWidth={48}
        trigger={null}
        collapsed={collapsed}
        style={{ borderRight: '1px solid #f0f0f0', position: 'relative' }}
      >
        <div className="logo" />
        <Menu mode="inline" defaultSelectedKeys={[location.pathname]}>
          {
            route.routes.map(route => (
              <Menu.Item key={route.path} icon={Icon[route.icon].render()}>
                {route.title}
              </Menu.Item>
            ))
          }
        </Menu>
        <div onClick={() => setCollapsed(!collapsed)} style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          borderTop: '1px solid #f0f0f0',
          height: 48,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer'
        }}>
          <span>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </span>
        </div>
      </Sider>
      <Layout className="site-layout">
        <Header style={{ height: 48, backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0' }} />
        <Breadcrumb style={{ padding: '8px 16px', backgroundColor: '#fff' }}>
          <Breadcrumb.Item>User</Breadcrumb.Item>
          <Breadcrumb.Item>Bill</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ margin: 16, padding: 16, backgroundColor: '#fff' }}>
          <div className="content" style={{ padding: 24, minHeight: 360 }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
