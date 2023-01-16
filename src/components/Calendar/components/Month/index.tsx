import { css } from '@emotion/react'
import { Button, Calendar, Divider, Popover, theme } from 'antd'
import dayjs from 'dayjs'
import { Fragment, useContext, useMemo, useState } from 'react'
import { CalendarContext } from '../..'
import { TranslateX, TranslateY } from '../../../Animation'
import useStyle from './style'

function CalendarMonth() {
  const { current, setCurrent, todo, onAction } = useContext(CalendarContext)
  const [selectedTodo, setSelectedTodo] = useState<string>('')
  const style = useStyle()

  return (
    <TranslateY css={style}>
      <Calendar
        fullscreen={true}
        headerRender={() => null}
        value={current}
        onSelect={value => {
          const _selectedTodo = value.format('YYYY-MM-DD')
          setSelectedTodo(_selectedTodo === selectedTodo ? '' : _selectedTodo)
        }}
        onChange={setCurrent}
        dateCellRender={value => {
          const date = value.format('YYYY-MM-DD')
          const todos = todo.filter(item => dayjs(item.start).format('YYYY-MM-DD') === date)
          return todos.length ? (
            <Popover
              open={selectedTodo === date}
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
                          {dayjs(item.start).format('HH:mm')} - {dayjs(item.end).format('HH:mm')}
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
