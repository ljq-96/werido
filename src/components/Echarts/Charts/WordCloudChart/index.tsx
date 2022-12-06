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

function WordCloudChart(props: IProps) {
  const { data = [0, 0], loading } = props
  const [{ themeColor }] = useUser()
  const plate = generate(themeColor)

  return (
    <Echarts
      loading={loading}
      option={{
        color: [themeColor],
        grid: {
          left: 0,
          top: 30,
          right: 40,
          bottom: 0,
          containLabel: true,
        },
        series: [
          {
            type: 'wordCloud',
            width: '100%',
            height: '100%',
            sizeRange: [12, 50],
            rotationRange: [0, 0],
            gridSize: 25,
            layoutAnimation: true,
            data: data,
          } as any,
        ],
      }}
    />
  )
}

export default memo(WordCloudChart, (pre, next) => {
  return isDeepEqual(pre, next)
})
