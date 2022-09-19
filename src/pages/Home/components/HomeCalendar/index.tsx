import { Button, DatePicker, Form, Input, Modal, Space } from 'antd'
import moment from 'moment'
import { Fragment, useEffect, useState } from 'react'
import { ITodo } from '../../../../../types'
import { request } from '../../../../api'
import Calendar from '../../../../components/Calendar'

function HomeCalendar() {
  const [showModal, setShowModal] = useState(false)
  const [onEditTodo, setOnEditTodo] = useState<ITodo>(null)
  const [todoList, setTodoList] = useState<ITodo[]>([])
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()

  const getTodoList = async () => {
    setLoading(true)
    const todo = await request.todo.get()
    setTodoList(todo)
    setLoading(false)
  }

  const handleFinish = async fields => {
    setSubmitLoading(true)
    const {
      date,
      time: [start, end],
      description,
    } = fields
    const dateStr = date.format().split('T')[0]
    const data = {
      start: start.format().replace(/(.*?)T/, dateStr + 'T'),
      end: end.format().replace(/(.*?)T/, dateStr + 'T'),
      description,
    }
    if (onEditTodo) {
      await request.todo.put({ _id: onEditTodo._id, ...data })
    } else {
      await request.todo.post(data)
    }

    await getTodoList()
    form.resetFields()
    setShowModal(false)
    setOnEditTodo(null)
    setSubmitLoading(false)
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
          <Button type='dashed' onClick={() => setShowModal(true)}>
            添加日程
          </Button>
        }
        onAction={({ type, todo }) => {
          switch (type) {
            case 'edit':
              const { start, end, description } = todo
              setShowModal(true)
              setOnEditTodo(todo)

              form.setFieldsValue({
                date: moment(start).startOf('day'),
                time: [moment(start), moment(end)],
                description,
              })
              break
            case 'delete':
              Modal.confirm({
                type: 'error',
                content: '是否删除此日程，不可恢复！',
                onOk: async () => {
                  await request.todo.delete(todo._id)
                  await getTodoList()
                },
              })
          }
        }}
      />
      <Modal
        title={`${onEditTodo ? '编辑' : '添加'}日程`}
        visible={!!showModal}
        onOk={form.submit}
        width={500}
        okButtonProps={{ loading: submitLoading }}
        onCancel={() => {
          setShowModal(false)
          setOnEditTodo(null)
          form.resetFields()
        }}
      >
        <Form form={form} onFinish={handleFinish}>
          <Form.Item label='起止时间' required>
            <Space>
              <Form.Item name='date' noStyle rules={[{ required: true, message: '请选择日期' }]}>
                <DatePicker />
              </Form.Item>
              <Form.Item name='time' noStyle rules={[{ required: true, message: '请选择时间' }]}>
                <DatePicker.RangePicker picker='time' />
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item label='日程内容' name='description' rules={[{ required: true, message: '请输入日程内容' }]}>
            <Input.TextArea placeholder='请输入日程内容' />
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  )
}

export default HomeCalendar
