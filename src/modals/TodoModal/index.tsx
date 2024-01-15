import { DatePicker, Form, Input, Modal, Space } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { request } from '../../api'
import EasyModal from '../../utils/easyModal'
import { ITodo } from '../../../types'

const TodoModal = EasyModal.create<ITodo>(() => {
  const modal = EasyModal.useModal<ITodo>()
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
    if (modal.props?._id) {
      await request.todo({ method: 'PUT', query: modal.props._id, data })
    } else {
      await request.todo({ method: 'POST', data })
    }
    modal.resolve()
    form.resetFields()
    modal.hide()
    setLoading(false)
  }

  useEffect(() => {
    if (modal.open && modal.props?._id) {
      const { start, end, description } = modal.props
      form.setFieldsValue({
        date: dayjs(start).startOf('day'),
        time: [dayjs(start), dayjs(end)],
        description,
      })
    }
  }, [modal.open, modal.props])

  return (
    <Modal
      title={`${modal.props?._id ? '编辑' : '添加'}日程`}
      open={modal.open}
      onOk={form.submit}
      width={500}
      okButtonProps={{ loading }}
      onCancel={() => {
        modal.hide()
        form.resetFields()
      }}
    >
      <Form form={form} variant='filled' onFinish={handleFinish}>
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
})

export default TodoModal
