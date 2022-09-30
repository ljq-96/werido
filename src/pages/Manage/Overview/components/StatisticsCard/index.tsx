import { Card, Divider, Skeleton, Spin } from 'antd'
import { Number } from '../../../../../components/Animation'

interface IProps {
  title: string
  count: number
  subTitle: string
  subCount: number
  loading?: boolean
}

function StatisticsCard(props: IProps) {
  const { title, count, subTitle, subCount, loading } = props
  return (
    <Card>
      <Skeleton active loading={loading} paragraph={{ rows: 2 }}>
        <div className='text-gray-400'>{title}</div>
        <div className='text-3xl'>
          <Number to={count} />
        </div>
        <Divider style={{ margin: '10px 0' }} />
        <div>
          <span className='mr-2'>{subTitle}</span>
          <Number to={subCount} />
        </div>
      </Skeleton>
    </Card>
  )
}

export default StatisticsCard
