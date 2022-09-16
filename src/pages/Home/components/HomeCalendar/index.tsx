import { Button, DatePicker, Form, Input, Modal } from 'antd'
import { Fragment, useState } from 'react'
import Calendar from '../../../../components/Calendar'

const events = [
  { start: '2022-09-12 09:00', end: '2022-09-12 10:00', description: '上班' },
  { start: '2022-09-15 09:50', end: '2022-09-15 10:50', description: '123456' },
  { start: '2022-09-15 11:50', end: '2022-09-15 12:30', description: '123456' },
  { start: '2022-09-15 12:50', end: '2022-09-15 15:50', description: '123456' },
  { start: '2022-09-15 13:10', end: '2022-09-15 20:30', description: '123456' },
  { start: '2022-09-16 18:00', end: '2022-09-16 23:59', description: '放假' },
]

function HomeCalendar() {
  const [showModal, setShowModal] = useState(false)
  const [onEditEvent, setOnEditEvent] = useState(null)
  const [form] = Form.useForm()
  return (
    <Fragment>
      <Calendar
        events={events}
        extra={
          <Button type='dashed' onClick={() => setShowModal(true)}>
            添加日程
          </Button>
        }
        onAction={({ type, event }) => {
          switch (type) {
            case 'edit':
              const { start, end, description } = event
              setShowModal(true)
              setOnEditEvent(event)
              form.setFieldsValue({
                time: [start, end],
                description,
              })
              break
            case 'delete':
              Modal.confirm({
                type: 'error',
                content: '是否删除此日程，不可恢复！',
                onOk: () => {},
              })
          }
        }}
      />
      <Modal
        title={`${onEditEvent ? '编辑' : '添加'}日程`}
        visible={!!showModal}
        onOk={form.submit}
        onCancel={() => {
          setShowModal(false)
          setOnEditEvent(null)
          form.resetFields()
        }}
      >
        <Form form={form}>
          <Form.Item label='起止时间' name='time' rules={[{ required: true, message: '请选择起止时间' }]}>
            <DatePicker.RangePicker showTime />
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
