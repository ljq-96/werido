import { Badge, Button, Popover, Spin, Tooltip } from 'antd'
import clsx from 'clsx'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { TranslateY } from '../../../Animation'
import { getEvents } from '../../utils'
import { CalendarContext } from '../..'
import './style.less'
import dayjs, { Dayjs } from 'dayjs'

const HOUR_HEIGHT = 25

function CalendarWeek() {
  const { current, todo, onAction, loading } = useContext(CalendarContext)

  const [time, setTime] = useState<Dayjs>(dayjs())
  const timer = useRef(null)

  const days = useMemo(() => {
    const dayIndex = current.day() === 0 ? 6 : current.day() - 1
    return ['一', '二', '三', '四', '五', '六', '日'].map((item, index) => {
      const day = dayjs(current).subtract(dayIndex - index, 'days')
      const _events = getEvents(todo, day)
      const res: typeof _events[] = []
      while (_events.length) {
        const g1 = _events.shift()
        const group = [g1]
        for (let i = 0; i < _events.length; i++) {
          const start = g1.start.valueOf()
          const end = g1.end.valueOf()
          if (
            (_events[i].start.valueOf() > start && _events[i].start.valueOf() < end) ||
            (_events[i].end.valueOf() > start && _events[i].end.valueOf() < end) ||
            (_events[i].start.valueOf() === start && _events[i].end.valueOf() === end)
          ) {
            group.push(_events.splice(i, 1)[0])
            i--
          }
        }
        res.push(group)
      }
      return {
        week: item,
        day,
        todos: res,
      }
    })
  }, [current, todo])

  useEffect(() => {
    timer.current = setInterval(() => {
      setTime(dayjs())
    }, 10000)
    return () => clearInterval(timer.current)
  }, [])

  return (
    <TranslateY className='calendar-week'>
      <div className='calendar-week-head'>
        <div className='calendar-week-head-info'>
          <div>{days[0].day.format('MM.DD')}</div>
          <div className='line' />
          <div>{days[6].day.format('MM.DD')}</div>
        </div>
        {days.map(item => (
          <div
            key={item.week}
            className={clsx(
              'calendar-week-head-item',
              item.day.date() === dayjs().date() && 'active',
              item.day.date() === current.date() && 'current',
            )}
          >
            <div>{item.week}</div>
            <div>{item.day.date()}</div>
          </div>
        ))}
      </div>
      <Spin spinning={loading} className='calendar-week-body-wrapper'>
        <div className='calendar-week-body'>
          <table>
            <tbody>
              {Array(24)
                .fill(1)
                .map((_, index) => (
                  <tr className='calendar-week-body-x' key={index}>
                    <td className='calendar-week-body-x-info'>
                      {index % 2 === 0 && (
                        <div>
                          {index <= 9 ? 0 : ''}
                          {index}:00
                        </div>
                      )}
                    </td>
                    {days.map((item, j) => (
                      <td className='calendar-week-body-y' key={'' + index + j} style={{ height: HOUR_HEIGHT }}>
                        {index === 0 &&
                          item.todos?.length > 0 &&
                          item.todos.map(todos =>
                            todos.map((todo, k) => (
                              <Popover
                                trigger={['click']}
                                placement='leftTop'
                                getPopupContainer={el => el.parentElement}
                                content={
                                  <div className='calendar-week-body-event-detail'>
                                    <div className='calendar-week-body-event-detail-time'>
                                      <Badge
                                        status={todo.end.valueOf() < dayjs().valueOf() ? 'default' : 'processing'}
                                        text={`${todo.start.format('MM.DD HH:mm')} - ${todo.end.format('MM.DD HH:mm')}`}
                                      />
                                    </div>
                                    <div className='calendar-week-body-event-detail-content'>{todo.description}</div>
                                    <div>
                                      <Button
                                        type='link'
                                        size='small'
                                        onClick={() =>
                                          onAction?.({
                                            type: 'edit',
                                            todo: { ...todo, start: todo.start.format(), end: todo.end.format() },
                                          })
                                        }
                                      >
                                        编辑
                                      </Button>
                                      <Button
                                        type='link'
                                        size='small'
                                        onClick={() =>
                                          onAction?.({
                                            type: 'delete',
                                            todo: { ...todo, start: todo.start.format(), end: todo.end.format() },
                                          })
                                        }
                                      >
                                        删除
                                      </Button>
                                    </div>
                                  </div>
                                }
                              >
                                <div
                                  className='calendar-week-body-events'
                                  style={{
                                    position: 'absolute',
                                    width: `calc(${(1 / todos.length) * 100}% - ${(todos.length - 1) * 2}px)`,
                                    height: ((todo.end.valueOf() - todo.start.valueOf()) / 3600_000) * HOUR_HEIGHT,
                                    top:
                                      ((todo.start.valueOf() - dayjs(todo.start).startOf('day').valueOf()) / 3600000) *
                                      HOUR_HEIGHT,
                                    left: `calc(${(k / todos.length) * 100}% + ${k * 2}px)`,
                                    backgroundColor: todo.end.valueOf() < dayjs().valueOf() ? '#f5f5f5' : undefined,
                                    borderColor: todo.end.valueOf() < dayjs().valueOf() ? '#aaa' : undefined,
                                  }}
                                >
                                  {todo.description}
                                </div>
                              </Popover>
                            )),
                          )}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
          <div
            className='calendar-week-time'
            style={{
              top: (time.valueOf() - dayjs().startOf('day').valueOf()) / 864000 + '%',
              transform: 'translateY(-50%)',
            }}
          >
            <div className='calendar-week-time-info'>{time.format('HH:mm')}</div>
            <div className='calendar-week-time-line'>
              {dayjs(current).startOf('week').valueOf() === dayjs().startOf('week').valueOf() && (
                <Tooltip title={time.format('YYYY-MM-DD HH:mm')}>
                  <div
                    className='calendar-week-time-dot status-processing'
                    style={{ left: ((dayjs().day() === 0 ? 6 : dayjs().day() - 1) / 7) * 100 + '%' }}
                  />
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </Spin>
    </TranslateY>
  )
}

export default CalendarWeek
