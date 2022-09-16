import moment, { Moment } from 'moment'
import { Events } from '.'

export function getEvents(events: Events[], current: Moment) {
  return events
    ?.filter(item => {
      const c = moment(item.start).valueOf()
      return c >= moment(current).startOf('day').valueOf() && c <= moment(current).endOf('day').valueOf()
    })
    ?.map(item => ({
      description: item.description,
      start: moment(item.start),
      end: moment(item.end),
    }))
}
