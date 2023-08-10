import { Button, Modal } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { HappyProvider } from '@ant-design/happy-work-theme'
import { ITodo } from '../../../../../types'
import { request } from '../../../../api'
import Calendar from '../../../../components/Calendar'
import EasyModal from '../../../../utils/easyModal'
import TodoModal from '../../../../modals/TodoModal'

function HomeCalendar() {
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
          <HappyProvider>
            <Button type='dashed' onClick={() => EasyModal.show(TodoModal, null).then(getTodoList)}>
              添加日程
            </Button>
          </HappyProvider>
        }
        onAction={({ type, todo }) => {
          switch (type) {
            case 'edit':
              EasyModal.show(TodoModal, todo).then(getTodoList)
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
