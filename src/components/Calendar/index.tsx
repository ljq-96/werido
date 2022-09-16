import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Card, CardProps, Radio, RadioChangeEvent, Segmented } from 'antd'
import moment, { Moment } from 'moment'
import { createContext, useCallback, useMemo, useState } from 'react'
import CalendarDay from './components/Day'
import CalendarMonth from './components/Month'
import CalendarWeek from './components/Week'

export interface Events {
  start: string
  end: string
  description: string
}

interface IProps extends CardProps {
  title?: string
  events?: Events[]
  onAction?: (params: { type: 'edit' | 'delete'; event: { start: Moment; end: Moment; description: string } }) => void
}

export const CalendarContext = createContext<{
  events?: Events[]
  current: Moment
  setCurrent: (time: Moment) => void
  onAction?: (params: { type: 'edit' | 'delete'; event: { start: Moment; end: Moment; description: string } }) => void
}>(null)

function Calendar(props: IProps) {
  const { title = '日历日程', events, onAction, ...reset } = props
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
    (e: RadioChangeEvent) => {
      const { value } = e.target
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
          <Radio.Group
            value={2}
            size='small'
            optionType='button'
            onChange={handleDate}
            options={[
              { label: <LeftOutlined />, value: 1 },
              {
                label:
                  status === '日'
                    ? current.format('yyyy.MM.DD')
                    : status === '周'
                    ? `${moment(current).startOf('week').subtract(-1, 'day').format('MM.DD')} - ${moment(current)
                        .endOf('week')
                        .subtract(-1, 'day')
                        .format('MM.DD')}`
                    : current.format('yyyy.MM'),
                value: 0,
              },
              { label: <RightOutlined />, value: -1 },
            ]}
          />
        </div>
        <Segmented size='small' value={status} onChange={setStatus as any} options={Object.keys(CalendarType)} />
      </div>
      <CalendarContext.Provider value={{ current, setCurrent, events, onAction }}>
        {CalendarType[status]}
      </CalendarContext.Provider>
    </Card>
  )
}

export default Calendar
