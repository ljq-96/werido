import Echarts from '../..'
import { EChartsOption, graphic } from 'echarts'
import { useUser } from '../../../../contexts/useUser'
import { generate } from '@ant-design/colors'
import { memo } from 'react'
import isDeepEqual from 'react-use/lib/misc/isDeepEqual'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

interface IProps {
  loading?: boolean
  data?: number[]
}

function TodoScatterChart(props: IProps) {
  const { data = [0, 0], loading } = props
  const [{ themeColor }] = useUser()
  const plate = generate(themeColor)

  return (
    <Echarts
      loading={loading}
      option={{
        tooltip: {
          formatter: val => {
            const {
              data: [, , time, desc],
            } = val
            return `${time} ${desc}`
          },
          axisPointer: {
            type: 'cross',
            snap: true,
            label: {
              formatter: e => dayjs.utc(e.value).format('HH:mm'),
            },
          },
        },
        xAxis: {
          name: '开始',
          nameLocation: 'end',
          nameRotate: 0,
          min: 0,
          max: 86399999,
          interval: 7200000,
          axisLabel: {
            formatter: val => {
              if (val === 86399999) return '24:00'
              return dayjs.utc(val).format('HH:mm')
            },
            rotate: 60,
          },
        },
        yAxis: {
          name: '结束',
          nameLocation: 'end',
          nameRotate: 0,
          min: 0,
          max: 86399999,
          interval: 7200000,
          axisLabel: {
            formatter: val => {
              if (val === 86399999) return '24:00'
              if (val) return dayjs.utc(val).format('HH:mm')
            },
          },
        },
        grid: {
          left: 0,
          top: 30,
          right: 40,
          bottom: 0,
          containLabel: true,
        },
        series: [
          {
            color: themeColor,
            symbolSize: 10,
            data: data,
            type: 'scatter',
          },
        ],
      }}
    />
  )
}

export default memo(TodoScatterChart, (pre, next) => {
  return isDeepEqual(pre, next)
})
