import Echarts from '../..'
import { EChartsOption, graphic } from 'echarts'
import { useUser } from '../../../../contexts/useUser'
import { generate } from '@ant-design/colors'
import { memo } from 'react'
import isDeepEqual from 'react-use/lib/misc/isDeepEqual'

interface IProps {
  loading?: boolean
  data?: {
    name: string
    value: number
  }[]
}

function BarChart(props: IProps) {
  const { data = [], loading } = props
  const [{ themeColor }] = useUser()
  const plate = generate(themeColor)

  return (
    <Echarts
      noData={!loading && !data.length}
      loading={loading}
      option={{
        xAxis: {
          type: 'category',
          data: data?.map(item => item.name),
        },
        grid: {
          left: 0,
          top: 10,
          right: 0,
          bottom: 0,
          containLabel: true,
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        series: [
          {
            data: data?.map(item => item.value),
            type: 'bar',
            itemStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: themeColor,
                },
                {
                  offset: 1,
                  color: plate[3],
                },
              ]),
            },
          },
        ],
      }}
    />
  )
}

export default memo(BarChart, (pre, next) => {
  return isDeepEqual(pre, next)
})
