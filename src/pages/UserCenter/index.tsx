import { Affix, Button, Card, Col, Row, Tabs } from 'antd'
import { Fragment, memo, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageProps } from '../../../types'
import { request } from '../../api'
import { TranslateX } from '../../components/Animation'
import UserCard from '../../components/UserCard'
import { useUser } from '../../contexts/useUser'
import './style.less'

function UserCenterLayout(props: PageProps) {
  const { route } = props
  const [count, setCount] = useState(null)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [user] = useUser()

  useEffect(() => {
    request.statistics.get('count').then(setCount)
  }, [])

  return (
    <Fragment>
      <Row gutter={[16, 16]} className='user-center'>
        <Col span={6}>
          <Affix target={() => document.getElementById('content')} offsetTop={16}>
            <TranslateX>
              <UserCard id={user?._id}>
                <Button type='primary' block shape='round'>
                  我的主页
                </Button>
              </UserCard>
            </TranslateX>
          </Affix>
        </Col>
        <Col span={18}>
          <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: '16px 16px 0' }}>
            <Tabs destroyInactiveTabPane onChange={navigate} activeKey={pathname}>
              {route.routes.map(item => (
                <Tabs.TabPane tab={item.name} tabKey={item.path} key={item.path}>
                  {<item.component />}
                </Tabs.TabPane>
              ))}
            </Tabs>
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
}

export default memo(UserCenterLayout)
