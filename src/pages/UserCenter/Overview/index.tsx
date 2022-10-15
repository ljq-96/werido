import { Card, Col, Row, Statistic } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { request } from '../../../api'
import { useUser } from '../../../contexts/useUser'
import { Number, TranslateX, TranslateY } from '../../../components/Animation'
import RoseChart from '../../../components/Echarts/Charts/RoseChart'
import LineChart from '../../../components/Echarts/Charts/LineChart'
import { StatisticsType } from '../../../../types/enum'
import { useStore } from '../../../contexts/useStore'
import { useRequest } from '../../../hooks'
import BarChart from '../../../components/Echarts/Charts/BarChart'
import TodoScatterChart from '../../../components/Echarts/Charts/TodoScatterChart'

function Dashboard() {
  const [{ tags }, { getTags }] = useStore()
  const {
    data: blogTime,
    loading: blogTimeLoading,
    execute: getBlogTime,
  } = useRequest(() => request.statistics({ method: 'GET', query: StatisticsType.文章时间 }))
  const {
    data: blogWords,
    loading: blogWordsLoading,
    execute: getBlogWords,
  } = useRequest(() => request.statistics({ method: 'GET', query: StatisticsType.文章字数 }))
  const {
    data: todo,
    loading: todoLoading,
    execute: getTodo,
  } = useRequest(() => request.statistics({ method: 'GET', query: StatisticsType.日历日程 }))
  useEffect(() => {
    getBlogTime()
    getBlogWords()
    getTodo()
    getTags()
  }, [])
  return (
    <Fragment>
      <TranslateY>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card title='新增文章'>
              <LineChart
                loading={blogTimeLoading}
                data={blogTime?.map(item => ({ name: item.time, value: item.value })) || []}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title='文章标签'>
              <RoseChart data={tags} />
            </Card>
          </Col>
          <Col span={12}>
            <Card title='我的日程'>
              <TodoScatterChart data={todo} loading={todoLoading} />
            </Card>
          </Col>
          <Col span={12}>
            <Card title='文章字数'>
              <BarChart data={blogWords} loading={blogWordsLoading} />
            </Card>
          </Col>
        </Row>
      </TranslateY>
    </Fragment>
  )
}

export default Dashboard
