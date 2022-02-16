import { useState, useEffect } from 'react'
import { Layout, Menu, Breadcrumb, message, Dropdown, Button } from 'antd'
import { IRouteComponentProps, history, ConnectProps, connect } from 'umi'
import * as Icon from '@ant-design/icons'
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons'
import { userApi } from '../api/index'
import Logo from '../components/Logo'
import { IStore } from '../models'
import { User } from '../../../interfaces'

const { Header, Content, Footer, Sider } = Layout
const { SubMenu } = Menu

type IProps = IRouteComponentProps &
  ConnectProps & {
    loginUser: User.Result
  }

function Layouts(props: IProps) {
  const { children, location, route, dispatch, loginUser } = props
  const [collapsed, setCollapsed] = useState(true)

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
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        theme="light"
        collapsedWidth={48}
        trigger={null}
        collapsed={collapsed}
        style={{ borderRight: '1px solid #f0f0f0', position: 'relative' }}
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            height: 56,
            alignItems: 'center',
            paddingLeft: collapsed ? 8 : 16,
            transition: '0.3s',
            overflow: 'hidden'
          }}
        >
          <Logo color={['#096dd9', '#91d5ff']} style={{ height: collapsed ? 30 : 48, transition: '0.3s' }} />
          <span style={{ position: 'absolute', color: '#096dd9', left: 60, fontSize: 20, fontWeight: 'bold', marginLeft: 8 }}>werido</span>
        </div>
        <Menu mode="inline" defaultSelectedKeys={[location.pathname]}>
          {route.routes.map((route) => (
            <Menu.Item key={route.path} icon={Icon[route.icon].render()}>
              {route.title}
            </Menu.Item>
          ))}
        </Menu>
        <div
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            borderTop: '1px solid #f0f0f0',
            height: 48,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            paddingLeft: collapsed ? 15 : 24,
            transition: '0.3s'
          }}
        >
          <span>{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</span>
        </div>
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            display: 'flex',
            flexDirection: 'row-reverse',
            alignItems: 'center',
            height: 48,
            padding: '0 16px',
            backgroundColor: '#fff',
            borderBottom: '1px solid #f0f0f0'
          }}
        >
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="admin"> 进入管理页</Menu.Item>
                <Menu.Item key="logout">登出</Menu.Item>
              </Menu>
            }
          >
            <Button type="text" icon={<UserOutlined />}>
              {loginUser?.username}
            </Button>
          </Dropdown>
        </Header>
        <Breadcrumb style={{ padding: '8px 16px', backgroundColor: '#fff' }}>
          <Breadcrumb.Item>User</Breadcrumb.Item>
          <Breadcrumb.Item>Bill</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ padding: 16, backgroundColor: '#fff' }}>
          <div className="content" style={{ padding: 24, minHeight: 360 }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default connect(({ store }: { store: IStore }) => {
  const { loginUser } = store
  return { loginUser }
})(Layouts)
