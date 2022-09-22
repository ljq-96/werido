import { Card, Col, Row } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { request } from '../../../api'
import { useUser } from '../../../contexts/useUser'
import { Number, TranslateX, TranslateY } from '../../../components/Animation'
import { StatisticsType } from '../../../../types/enum'
import RiverChart from '../../../components/Echarts/Charts/RiverChart'

const HEIGHT = 400
function Dashboard() {
  const [userActive, setUserActive] = useState<{ name: string; value: number }[]>([])
  const [time, setTime] = useState<{ type: string; value: number }[]>([])
  const [{ themeColor }] = useUser()
  useEffect(() => {
    Promise.all([request.admin.statistics.get(StatisticsType.用户活跃度)]).then(([res1]) => {
      setUserActive(res1)
    })
  }, [])
  return (
    <Fragment>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <TranslateX delay={0}>
            <Card>
              <Number to={10} />
            </Card>
          </TranslateX>
        </Col>
        <Col span={6}>
          <TranslateX delay={200}>
            <Card></Card>
          </TranslateX>
        </Col>
        <Col span={6}>
          <TranslateX delay={400}>
            <Card></Card>
          </TranslateX>
        </Col>
        <Col span={6}>
          <TranslateX delay={600}>
            <Card></Card>
          </TranslateX>
        </Col>
        <Col span={8}>
          <TranslateY delay={800}>
            <Card title='用户活跃度'>
              <div style={{ height: HEIGHT }}>
                <RiverChart data={userActive} />
              </div>
            </Card>
          </TranslateY>
        </Col>
        <Col span={8}>
          <TranslateY delay={1000}>
            <Card title='标签'>
              <div style={{ height: HEIGHT }}></div>
            </Card>
          </TranslateY>
        </Col>
      </Row>
    </Fragment>
  )
}

export default Dashboard
