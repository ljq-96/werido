import moment, { Moment } from 'moment'
import { ITodo } from '../../../types'

export function getEvents(events: ITodo[], current: Moment) {
  return events
    ?.filter(item => {
      const c = moment(item.start).valueOf()
      return c >= moment(current).startOf('day').valueOf() && c <= moment(current).endOf('day').valueOf()
    })
    ?.map(item => ({
      ...item,
      start: moment(item.start),
      end: moment(item.end),
    }))
}
