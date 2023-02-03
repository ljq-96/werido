import { DatePicker, Form, Input, Modal, Space } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { request } from '../../api'
import { useModal } from '../../contexts/useModal'
import { basicModalView, ModalActions } from '../../contexts/useModal/actions'

function TodoModal() {
  const [{ modalAction, todoModalOptions }, { dispatch }] = useModal()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const handleFinish = async fields => {
    setLoading(true)
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
    if (todoModalOptions) {
      await request.todo({ method: 'PUT', query: todoModalOptions._id, data })
    } else {
      await request.todo({ method: 'POST', data })
    }
    todoModalOptions?.onOk()
    form.resetFields()
    dispatch(basicModalView.destroy.actions())
    setLoading(false)
  }

  useEffect(() => {
    if (modalAction === ModalActions.todoModal && todoModalOptions) {
      const { start, end, description } = todoModalOptions
      form.setFieldsValue({
        date: dayjs(start).startOf('day'),
        time: [dayjs(start), dayjs(end)],
        description,
      })
    }
  }, [modalAction, todoModalOptions])

  return (
    <Modal
      title={`${todoModalOptions ? '编辑' : '添加'}日程`}
      open={modalAction === ModalActions.todoModal}
      onOk={form.submit}
      width={500}
      okButtonProps={{ loading }}
      onCancel={() => {
        dispatch(basicModalView.destroy.actions())
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
          <Input placeholder='请输入日程内容' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default TodoModal
