import { Card, Col, Row, Statistic } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { request } from '../../../api'
import { useUser } from '../../../contexts/useUser'
import { Number, TranslateX, TranslateY } from '../../../components/Animation'
import RoseChart from '../../../components/Echarts/Charts/RoseChart'
import LineChart from '../../../components/Echarts/Charts/LineChart'
import { StatisticsType } from '../../../../types/enum'

const HEIGHT = 400
function Dashboard() {
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<{ name: string; value: number }[]>([])
  const [time, setTime] = useState<{ name: string; value: number }[]>([])
  useEffect(() => {
    setLoading(true)
    Promise.all([request.statistics.get(StatisticsType.文章标签), request.statistics.get(StatisticsType.文章时间)])
      .then(([res1, res2]) => {
        setTags(res1)
        setTime(res2.map(item => ({ name: item.time, value: item.value })))
      })
      .finally(() => setLoading(false))
  }, [])
  return (
    <Fragment>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <TranslateY delay={200}>
            <Card title='时间'>
              <div style={{ height: HEIGHT }}>
                <LineChart loading={loading} data={time} />
              </div>
            </Card>
          </TranslateY>
        </Col>
        <Col span={12}>
          <TranslateY delay={400}>
            <Card title='标签'>
              <div style={{ height: HEIGHT }}>
                <RoseChart loading={loading} data={tags} />
              </div>
            </Card>
          </TranslateY>
        </Col>
      </Row>
    </Fragment>
  )
}

export default Dashboard
