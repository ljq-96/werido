import Echarts from '../..'
import { EChartsOption, graphic } from 'echarts'
import { useUser } from '../../../../contexts/useUser'
import { generate } from '@ant-design/colors'

interface IProps {
  loading?: boolean
  data?: {
    name: string
    value: number
  }[]
}

function LineChart(props: IProps) {
  const { data = [], loading } = props
  const [{ themeColor }] = useUser()
  const plate = generate(themeColor)

  return (
    <Echarts
      loading={loading}
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
            itemStyle: {
              color: themeColor,
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

export default LineChart
