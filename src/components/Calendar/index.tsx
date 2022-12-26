import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Card, CardProps, Segmented, Space } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { createContext, useCallback, useMemo, useState } from 'react'
import { ITodo } from '../../../types'
import CalendarDay from './components/Day'
import CalendarMonth from './components/Month'
import CalendarWeek from './components/Week'

interface IProps extends CardProps {
  title?: string
  todo?: ITodo[]
  loading?: boolean
  onAction?: (params: { type: 'edit' | 'delete'; todo: ITodo }) => void
}

export const CalendarContext = createContext<{
  todo?: ITodo[]
  current: Dayjs
  setCurrent: (time: Dayjs) => void
  onAction?: (params: { type: 'edit' | 'delete'; todo: ITodo }) => void
  loading?: boolean
}>(null)

function Calendar(props: IProps) {
  const { title = '日历日程', todo, onAction, loading, ...reset } = props
  const [status, setStatus] = useState<'日' | '周' | '月'>('周')
  const [current, setCurrent] = useState(dayjs())

  const CalendarType = useMemo(() => {
    return {
      日: <CalendarDay />,
      周: <CalendarWeek />,
      月: <CalendarMonth />,
    }
  }, [])

  const handleDate = useCallback(
    (value: number) => {
      if (value === 0) {
        setCurrent(dayjs())
        return
      }
      switch (status) {
        case '日':
          setCurrent(dayjs(current).subtract(value, 'day'))
          break
        case '周':
          setCurrent(dayjs(current).subtract(value, 'week'))
          break
        case '月':
          setCurrent(dayjs(current).subtract(value, 'month'))
          break
      }
    },
    [status, current, setCurrent],
  )
  return (
    <Card title={title} bodyStyle={{ padding: 0 }} {...reset}>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: 16 }}>
        <div>
          <Space.Compact size='small'>
            <Button icon={<LeftOutlined />} onClick={() => handleDate(1)} />
            <Button onClick={() => handleDate(0)}>
              {status === '日'
                ? current.format('YYYY.MM.DD')
                : status === '周'
                ? `${dayjs(current).startOf('week').format('MM.DD')} - ${dayjs(current).endOf('week').format('MM.DD')}`
                : current.format('YYYY.MM')}
            </Button>
            <Button icon={<RightOutlined />} onClick={() => handleDate(-1)} />
          </Space.Compact>
        </div>
        <Segmented size='small' value={status} onChange={setStatus as any} options={Object.keys(CalendarType)} />
      </div>
      <CalendarContext.Provider value={{ current, setCurrent, todo, onAction, loading }}>
        {CalendarType[status]}
      </CalendarContext.Provider>
    </Card>
  )
}

export default Calendar
