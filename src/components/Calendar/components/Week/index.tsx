import { Badge, Button, Popover } from 'antd'
import clsx from 'clsx'
import moment, { Moment } from 'moment'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { TranslateY } from '../../../Animation'
import { getEvents } from '../../utils'
import { CalendarContext } from '../..'
import './style.less'

const HOUR_HEIGHT = 25

function CalendarWeek() {
  const { current, events, onAction } = useContext(CalendarContext)
  const [time, setTime] = useState<Moment>(moment())
  const timer = useRef(null)

  const days = useMemo(() => {
    const dayIndex = current.day() === 0 ? 6 : current.day() - 1
    return ['一', '二', '三', '四', '五', '六', '日'].map((item, index) => {
      const day = moment(current).subtract(dayIndex - index, 'days')
      const _events = getEvents(events, day)
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
        events: res,
      }
    })
  }, [current])

  useEffect(() => {
    timer.current = setInterval(() => {
      setTime(moment())
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
              item.day.date() === moment().date() && 'active',
              item.day.date() === current.date() && 'current',
            )}
          >
            <div>{item.week}</div>
            <div>{item.day.date()}</div>
          </div>
        ))}
      </div>
      <div className='calendar-week-body-wrapper'>
        <div className='calendar-week-body'>
          <table>
            {Array(12)
              .fill(1)
              .map((_, index) => (
                <tr className='calendar-week-body-x'>
                  <td className='calendar-week-body-x-info'>
                    <div>
                      {index <= 4 ? 0 : ''}
                      {index * 2}:00
                    </div>
                  </td>
                  {days.map((item, j) => (
                    <td className='calendar-week-body-y'>
                      {index === 0 &&
                        item.events?.length > 0 &&
                        item.events.map(events =>
                          events.map((ev, k) => (
                            <Popover
                              trigger={['click']}
                              placement='leftTop'
                              getPopupContainer={el => el.parentElement}
                              content={
                                <div className='calendar-week-body-event-detail'>
                                  <div className='calendar-week-body-event-detail-time'>
                                    <Badge
                                      status={ev.end.valueOf() < moment().valueOf() ? 'default' : 'processing'}
                                      text={`${ev.start.format('MM.DD HH:mm')} - ${ev.end.format('MM.DD HH:mm')}`}
                                    />
                                  </div>
                                  <div className='calendar-week-body-event-detail-content'>{ev.description}</div>
                                  <div>
                                    <Button
                                      type='link'
                                      size='small'
                                      onClick={() => onAction?.({ type: 'edit', event: ev })}
                                    >
                                      编辑
                                    </Button>
                                    <Button
                                      type='link'
                                      size='small'
                                      onClick={() => onAction?.({ type: 'delete', event: ev })}
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
                                  width: `calc(${(1 / events.length) * 100}% - ${(events.length - 1) * 2}px)`,
                                  height: ((ev.end.valueOf() - ev.start.valueOf()) / 3600_000) * HOUR_HEIGHT,
                                  top:
                                    ((ev.start.valueOf() - moment(ev.start).startOf('day').valueOf()) / 3600000) *
                                    HOUR_HEIGHT,
                                  left: `calc(${(k / events.length) * 100}% + ${k * 2}px)`,
                                  backgroundColor: ev.end.valueOf() < moment().valueOf() ? '#f5f5f5' : undefined,
                                  borderColor: ev.end.valueOf() < moment().valueOf() ? '#aaa' : undefined,
                                }}
                              >
                                {ev.description}
                              </div>
                            </Popover>
                          )),
                        )}
                    </td>
                  ))}
                </tr>
              ))}
          </table>
          <div
            className='calendar-week-time'
            style={{
              top: (time.valueOf() - moment().startOf('day').valueOf()) / 864000 + '%',
              transform: 'translateY(-50%)',
            }}
          >
            <div className='calendar-week-time-info'>{time.format('HH:mm')}</div>
            <div className='calendar-week-time-line'>
              <div
                className='calendar-week-time-dot ant-badge-status-processing'
                style={{ left: ((moment().day() === 0 ? 6 : moment().day() - 1) / 7) * 100 + '%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </TranslateY>
  )
}

export default CalendarWeek
