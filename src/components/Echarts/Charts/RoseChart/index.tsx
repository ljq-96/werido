import { theme } from 'antd'
import Echarts from '../..'
import { EChartsOption } from 'echarts'
import { memo } from 'react'
import isDeepEqual from 'react-use/lib/misc/isDeepEqual'

interface IProps {
  loading?: boolean
  data: {
    name: string
    value: number
  }[]
}

function RoseChart(props: IProps) {
  const { data = [], loading } = props
  const {
    token: { colorPrimary },
  } = theme.useToken()

  return (
    <Echarts
      loading={loading}
      noData={!loading && !data.length}
      option={{
        grid: {
          left: 10,
          top: 10,
          right: 10,
          bottom: 10,
          containLabel: false,
        },
        tooltip: {
          trigger: 'item',
        },
        visualMap: [
          {
            show: false,
            min: Math.min(...data?.map(item => item.value)),
            max: Math.max(...data?.map(item => item.value)),
            inRange: {
              opacity: [0.4, 1],
            },
          },
        ],
        series: [
          {
            type: 'pie',
            radius: ['25%', '80%'],
            center: ['50%', '50%'],
            roseType: 'radius',
            label: {
              show: true,
            },
            labelLine: {
              smooth: true,
            },
            emphasis: {
              label: {
                show: true,
              },
            },
            itemStyle: {
              color: colorPrimary,
            },
            data: data?.filter(item => !!item.value),
          },
        ],
      }}
    />
  )
}

export default memo(RoseChart, (pre, next) => {
  return isDeepEqual(pre, next)
})
