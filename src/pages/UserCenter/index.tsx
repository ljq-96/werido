import { Affix, Button, Card, Col, Menu, Row, Tabs } from 'antd'
import { Fragment, memo } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { PageProps } from '../../../types'
import { TranslateX } from '../../components/Animation'
import UserCard from '../../components/UserCard'
import { useUser } from '../../contexts/useUser'
import { useParseRoute } from '../../hooks'
import './style.less'

function UserCenterLayout(props: PageProps) {
  const { route } = props
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [user] = useUser()

  const parsedRoute = useParseRoute(route, { showAll: true })

  return (
    <Fragment>
      <Row gutter={[16, 16]} className='user-center'>
        <Col span={6}>
          <Affix offsetTop={80}>
            <div>
              <TranslateX>
                <UserCard user={user}>
                  <div>
                    <Button type='primary' block shape='round' onClick={() => navigate(`/people/${user.username}/`)}>
                      我的主页
                    </Button>
                  </div>
                </UserCard>
              </TranslateX>
            </div>
          </Affix>
        </Col>
        <Col span={18}>
          <TranslateX distance={20}>
            {/* <Card style={{ marginBottom: 16 }}> */}
            {/* <Menu
                mode={'horizontal'}
                selectedKeys={[pathname]}
                style={{ marginBottom: 16 }}
                onClick={e => navigate(e.key)}
                items={parsedRoute.routes.map(item => ({
                  label: item.name,
                  key: item.path,
                  icon: item.icon,
                  children: item.routes?.map(k => ({
                    label: k.name,
                    key: k.path,
                  })),
                }))}
              /> */}
            <Outlet />
            {/* </Card> */}
          </TranslateX>
        </Col>
      </Row>
    </Fragment>
  )
}

export default memo(UserCenterLayout)
