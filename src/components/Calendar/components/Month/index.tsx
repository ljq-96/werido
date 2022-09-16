import { Calendar } from 'antd'
import moment from 'moment'
import { useContext } from 'react'
import { CalendarContext } from '../..'
import { TranslateY } from '../../../Animation'

function CalendarMonth() {
  const { current, setCurrent } = useContext(CalendarContext)
  return (
    <TranslateY>
      <Calendar fullscreen={false} headerRender={() => null} value={moment(current)} onChange={setCurrent} />
    </TranslateY>
  )
}

export default CalendarMonth
