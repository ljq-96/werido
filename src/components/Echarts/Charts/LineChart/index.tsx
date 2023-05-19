import Echarts from '../..'
import { EChartsOption, graphic } from 'echarts'
import { generate } from '@ant-design/colors'
import { CSSProperties, memo } from 'react'
import isDeepEqual from 'react-use/lib/misc/isDeepEqual'
import { theme } from 'antd'

interface IProps {
  loading?: boolean
  style?: CSSProperties
  data?: {
    name: string
    value: number
  }[]
}

function LineChart(props: IProps) {
  const { data = [], loading, style } = props
  const {
    token: { colorPrimary },
  } = theme.useToken()
  const plate = generate(colorPrimary)

  return (
    <Echarts
      style={style}
      loading={loading}
      noData={!loading && !data.length}
      option={{
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data?.map(item => item.name),
        },
        grid: {
          left: '10px',
          top: 5,
          right: 25,
          bottom: 0,
          containLabel: true,
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
        },
        tooltip: {
          trigger: 'axis',
        },
        series: [
          {
            data: data?.map(item => item.value),
            type: 'line',
            smooth: true,
            showSymbol: false,
            itemStyle: {
              color: colorPrimary,
            },
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: plate[3],
                },
                {
                  offset: 1,
                  color: '#fff',
                },
              ]),
            },
          },
        ],
      }}
    />
  )
}

export default memo(LineChart, (pre, next) => {
  return isDeepEqual(pre, next)
})
