import { useState, useEffect } from 'react'
import { Layout, Menu, Breadcrumb, message } from 'antd'
import { IRouteComponentProps, history, ConnectProps, connect } from 'umi'
import * as Icon from '@ant-design/icons'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { userApi } from '../api/index'

const { Header, Content, Footer, Sider } = Layout
const { SubMenu } = Menu

type IProps = IRouteComponentProps & ConnectProps

function Layouts(props: IProps) {
  const { children, location, route, dispatch } = props
  const [collapsed, setCollapsed] = useState(true)
  
  useEffect(() => {
    userApi.getLoginUser().then(res => {
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

export default connect()(Layouts)
