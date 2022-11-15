import { EChartsOption, graphic } from 'echarts'
import { generate } from '@ant-design/colors'
import { CSSProperties, memo } from 'react'
import { useUser } from '../../../contexts/useUser'
import ReactEcharts from '../../../components/Echarts'
import isDeepEqual from 'react-use/lib/misc/isDeepEqual'

interface IProps {
  loading?: boolean
  style?: CSSProperties
  data?: {
    name: string
    value: number
    info: any
  }[]
}

function TempChart(props: IProps) {
  const { data, loading, style } = props
  const [{ themeColor }] = useUser()
  const plate = generate(themeColor)

  return (
    <ReactEcharts
      style={style}
      loading={loading}
      option={{
        xAxis: {
          type: 'category',
          show: false,
          boundaryGap: false,
          data: data?.map(item => item.name),
        },
        grid: {
          left: 0,
          top: 5,
          right: 0,
          bottom: 0,
          containLabel: true,
        },
        yAxis: {
          type: 'value',
          show: false,
        },
        tooltip: {
          trigger: 'axis',
          formatter: value => {
            const cur = data[value[0].dataIndex]
            return `${cur.name}<br/> ${cur.info.text} ${cur.value}°C`
          },
        },
        series: [
          {
            symbol: 'circle',
            showSymbol: false,
            data: data?.map(item => item.value),
            type: 'line',
            smooth: true,
            itemStyle: {
              color: '#7a7a7a',
            },
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#ccc',
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

export default memo(TempChart, (pre, next) => {
  return isDeepEqual(pre, next)
})
