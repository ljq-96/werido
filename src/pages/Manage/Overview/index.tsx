import { Card, Col, Row } from 'antd'
import { Fragment, useEffect } from 'react'
import { request } from '../../../api'
import { TranslateX, TranslateY } from '../../../components/Animation'
import { StatisticsType } from '../../../../types/enum'
import RiverChart from '../../../components/Echarts/Charts/RiverChart'
import StatisticsCard from './components/StatisticsCard'
import { useRequest } from '../../../hooks'
import LineChart from '../../../components/Echarts/Charts/LineChart'
import BarChart from '../../../components/Echarts/Charts/BarChart'
import TodoScatterChart from '../../../components/Echarts/Charts/TodoScatterChart'
import WordCloudChart from '../../../components/Echarts/Charts/WordCloudChart'
import { CalendarOutlined, FileTextOutlined, TagsOutlined, UserOutlined } from '@ant-design/icons'

function Dashboard() {
  const {
    data: blogTime,
    execute: getBlogTime,
    loading: blogTimeLoading,
  } = useRequest(() => request.adminStatistics.getBlogTime({ method: 'GET' }))
  const {
    data: blogWords,
    execute: getBlogWords,
    loading: blogWordsLoading,
  } = useRequest(() => request.adminStatistics.getBlogWords({ method: 'GET' }))
  const {
    data: statistics,
    execute: getStatistics,
    loading: statisticsLoading,
  } = useRequest(() => request.adminStatistics.statistic({ method: 'GET' }))
  const {
    data: userActive,
    execute: getUserActive,
    loading: userActiveLoading,
  } = useRequest(() => request.adminStatistics.userActive({ method: 'GET' }))
  const {
    data: todo,
    execute: getTodo,
    loading: todoLoading,
  } = useRequest(() => request.adminStatistics.getTodo({ method: 'GET' }))
  const {
    data: tagCount,
    execute: getTagCount,
    loading: tagCountLoading,
  } = useRequest(() => request.adminStatistics.getBlogTags({ method: 'GET' }))

  useEffect(() => {
    getBlogTime()
    getBlogWords()
    getStatistics()
    getUserActive()
    getTodo()
    getTagCount()
  }, [])

  return (
    <Fragment>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <TranslateX delay={200}>
            <StatisticsCard
              title='用户数量'
              extra={<UserOutlined />}
              count={statistics?.userCount}
              subTitle='今日活跃'
              subCount={statistics?.dailyActiveUserCount}
              loading={statisticsLoading}
            />
          </TranslateX>
        </Col>
        <Col span={6}>
          <TranslateY>
            <StatisticsCard
              title='文章数量'
              extra={<FileTextOutlined />}
              count={statistics?.blogCount}
              subTitle='本月新增'
              subCount={statistics?.blogMonthIncreased}
              loading={statisticsLoading}
            />
          </TranslateY>
        </Col>
        <Col span={6}>
          <TranslateY>
            <StatisticsCard
              title='书签数量'
              extra={<TagsOutlined />}
              count={statistics?.bookmarkCount}
              subTitle='本月新增'
              subCount={statistics?.bookmarkMonthIncreased}
              loading={statisticsLoading}
            />
          </TranslateY>
        </Col>
        <Col span={6}>
          <TranslateX delay={200} distance={20}>
            <StatisticsCard
              title='日程总数'
              extra={<CalendarOutlined />}
              count={statistics?.todoCount}
              subTitle='待办'
              subCount={statistics?.unTodoCount}
              loading={statisticsLoading}
            />
          </TranslateX>
        </Col>
        <Col span={8}>
          <TranslateX delay={400}>
            <Card title='用户活跃度'>
              <RiverChart data={userActive} loading={userActiveLoading} />
            </Card>
          </TranslateX>
        </Col>
        <Col span={8}>
          <TranslateY delay={200}>
            <Card title='日程统计'>
              <TodoScatterChart data={todo} loading={todoLoading} />
            </Card>
          </TranslateY>
        </Col>
        <Col span={8}>
          <TranslateX delay={400} distance={20}>
            <Card title='文章标签'>
              <WordCloudChart data={tagCount || []} loading={tagCountLoading} />
            </Card>
          </TranslateX>
        </Col>
        <Col span={8}>
          <TranslateX delay={600}>
            <Card title='文章字数'>
              <BarChart data={blogWords} loading={blogWordsLoading} />
            </Card>
          </TranslateX>
        </Col>
        <Col span={16}>
          <TranslateX delay={600} distance={20}>
            <Card title='新增文章'>
              <LineChart
                data={blogTime?.map(item => ({ name: item.time, value: item.value }))}
                loading={blogTimeLoading}
              />
            </Card>
          </TranslateX>
        </Col>
      </Row>
    </Fragment>
  )
}

export default Dashboard
