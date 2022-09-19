import { Button, Calendar, Divider, Popover } from 'antd'
import moment from 'moment'
import { Fragment, useContext, useState } from 'react'
import { CalendarContext } from '../..'
import { TranslateX, TranslateY } from '../../../Animation'
import './style.less'

function CalendarMonth() {
  const { current, setCurrent, todo, onAction } = useContext(CalendarContext)
  const [selectedTodo, setSelectedTodo] = useState<string>('')
  return (
    <TranslateY className='calendar-month'>
      <Calendar
        fullscreen={true}
        headerRender={() => null}
        value={moment(current)}
        onSelect={value => {
          const _selectedTodo = value.format('yyyy-MM-DD')
          setSelectedTodo(_selectedTodo === selectedTodo ? '' : _selectedTodo)
        }}
        onChange={setCurrent}
        dateCellRender={value => {
          const date = value.format('yyyy-MM-DD')
          const todos = todo.filter(item => moment(item.start).format('yyyy-MM-DD') === date)
          return todos.length ? (
            <Popover
              visible={selectedTodo === date}
              trigger={['click']}
              placement='leftTop'
              getPopupContainer={el => document.querySelector('.calendar-month')}
              content={
                <div className='calendar-month-detail-list'>
                  {todos.map((item, index) => (
                    <Fragment>
                      {index !== 0 && <Divider />}
                      <div key={item._id} className='calendar-month-detail-item'>
                        <div>
                          {moment(item.start).format('HH:mm')} - {moment(item.end).format('HH:mm')}
                        </div>
                        <div>{item.description}</div>
                        <div>
                          <Button
                            type='link'
                            size='small'
                            onClick={() =>
                              onAction?.({
                                type: 'edit',
                                todo: item,
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
                                todo: item,
                              })
                            }
                          >
                            删除
                          </Button>
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
              }
            >
              <div className='calendar-month-todo-list'>
                <TranslateX.List interval={200}>
                  {todos.map(item => (
                    <div key={item._id} className='calendar-month-todo-item'>
                      {item.description}
                    </div>
                  ))}
                </TranslateX.List>
              </div>
            </Popover>
          ) : null
        }}
      />
    </TranslateY>
  )
}

export default CalendarMonth
