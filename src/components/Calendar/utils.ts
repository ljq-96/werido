import dayjs, { Dayjs } from 'dayjs'
import { ITodo } from '../../../types'

export function getEvents(events: ITodo[], current: Dayjs) {
  return events
    ?.filter(item => {
      const c = dayjs(item.start).valueOf()
      return c >= dayjs(current).startOf('day').valueOf() && c <= dayjs(current).endOf('day').valueOf()
    })
    ?.map(item => ({
      ...item,
      start: dayjs(item.start),
      end: dayjs(item.end),
    }))
}
