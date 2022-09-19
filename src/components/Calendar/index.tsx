import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Card, CardProps, Radio, RadioChangeEvent, Segmented } from 'antd'
import moment, { Moment } from 'moment'
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
  current: Moment
  setCurrent: (time: Moment) => void
  onAction?: (params: { type: 'edit' | 'delete'; todo: ITodo }) => void
  loading?: boolean
}>(null)

function Calendar(props: IProps) {
  const { title = '日历日程', todo, onAction, loading, ...reset } = props
  const [status, setStatus] = useState<'日' | '周' | '月'>('周')
  const [current, setCurrent] = useState(moment())

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
        setCurrent(moment())
        return
      }
      switch (status) {
        case '日':
          setCurrent(moment(current).subtract(value, 'day'))
          break
        case '周':
          setCurrent(moment(current).subtract(value, 'week'))
          break
        case '月':
          setCurrent(moment(current).subtract(value, 'month'))
          break
      }
    },
    [status, current, setCurrent],
  )
  return (
    <Card title={title} bodyStyle={{ padding: 0 }} {...reset}>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: 16 }}>
        <div>
          <Button.Group size='small'>
            <Button icon={<LeftOutlined />} onClick={() => handleDate(1)} />
            <Button onClick={() => handleDate(0)}>
              {status === '日'
                ? current.format('yyyy.MM.DD')
                : status === '周'
                ? `${moment(current).startOf('week').format('MM.DD')} - ${moment(current)
                    .endOf('week')
                    .format('MM.DD')}`
                : current.format('yyyy.MM')}
            </Button>
            <Button icon={<RightOutlined />} onClick={() => handleDate(-1)} />
          </Button.Group>
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
