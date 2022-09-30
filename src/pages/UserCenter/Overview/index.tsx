import { Card, Col, Row, Statistic } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { request } from '../../../api'
import { useUser } from '../../../contexts/useUser'
import { Number, TranslateX, TranslateY } from '../../../components/Animation'
import RoseChart from '../../../components/Echarts/Charts/RoseChart'
import LineChart from '../../../components/Echarts/Charts/LineChart'
import { StatisticsType } from '../../../../types/enum'
import { useStore } from '../../../contexts/useStore'
import useRequest from '../../../hooks/useRequest'

function Dashboard() {
  const [{ tags }, { getTags }] = useStore()
  const {
    data: blogTime,
    loading: blogTimeLoading,
    execute: getBlogTime,
  } = useRequest(() => request.statistics.get(StatisticsType.文章时间))
  useEffect(() => {
    getBlogTime()
    getTags()
  }, [])
  return (
    <Fragment>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <TranslateY delay={200}>
            <Card title='时间'>
              <LineChart
                loading={blogTimeLoading}
                data={blogTime?.map(item => ({ name: item.time, value: item.value })) || []}
              />
            </Card>
          </TranslateY>
        </Col>
        <Col span={12}>
          <TranslateY delay={400}>
            <Card title='标签'>
              <RoseChart data={tags} />
            </Card>
          </TranslateY>
        </Col>
      </Row>
    </Fragment>
  )
}

export default Dashboard
