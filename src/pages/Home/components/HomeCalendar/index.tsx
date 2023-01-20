import { Button, Modal } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { ITodo } from '../../../../../types'
import { request } from '../../../../api'
import Calendar from '../../../../components/Calendar'
import { useModal } from '../../../../contexts/useModal'
import { basicModalView } from '../../../../contexts/useModal/actions'

function HomeCalendar() {
  const [_, { dispatch }] = useModal()
  const [todoList, setTodoList] = useState<ITodo[]>([])
  const [loading, setLoading] = useState(false)

  const getTodoList = async () => {
    setLoading(true)
    const todo = await request.todo({ method: 'GET' })
    setTodoList(todo)
    setLoading(false)
  }

  useEffect(() => {
    getTodoList()
  }, [])

  return (
    <Fragment>
      <Calendar
        todo={todoList}
        loading={loading}
        extra={
          <Button
            type='dashed'
            onClick={() => dispatch(basicModalView.todoModal.actions(true, null, { onOk: getTodoList }))}
          >
            添加日程
          </Button>
        }
        onAction={({ type, todo }) => {
          switch (type) {
            case 'edit':
              dispatch(basicModalView.todoModal.actions(true, todo, { onOk: getTodoList }))
              break
            case 'delete':
              Modal.confirm({
                type: 'error',
                content: '是否删除此日程，不可恢复！',
                onOk: async () => {
                  await request.todo({ method: 'DELETE', query: todo._id })
                  await getTodoList()
                },
              })
          }
        }}
      />
    </Fragment>
  )
}

export default HomeCalendar
