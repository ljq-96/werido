import { InfoCircleOutlined } from '@ant-design/icons'
import { Button, DatePicker, Form, Input, message, Modal, Space, Tag } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import dayjs from 'dayjs'
import { Fragment, useRef, useState } from 'react'
import { ITodo } from '../../../../types'
import { UserStatus } from '../../../../types/enum'
import { request } from '../../../api'
import CommonTable, { CommonTableInstance, ToolItem } from '../../../components/CommonTable'
import { formatTime } from '../../../utils/common'

const toolList: ToolItem[] = [
  {
    type: 'input',
    name: 'creator',
    label: '用户',
  },
  {
    type: 'input',
    name: 'decription',
    label: '日程内容',
  },
  {
    type: 'date',
    name: 'time',
    label: '日程时间',
  },
  {
    type: 'date',
    name: 'createTime',
    label: '创建时间',
  },
]

function TodoManage() {
  const [showModal, setShowModal] = useState<ITodo>(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()
  const tableRef = useRef<CommonTableInstance>(null)

  const handleDelete = (id: string) => {
    Modal.confirm({
      type: 'error',
      title: '警告',
      icon: <InfoCircleOutlined style={{ color: 'red' }} />,
      content: '确定要删除此日程吗？',
      okButtonProps: { danger: true, children: '删除' },
      onOk() {
        return request.admin.todo({ method: 'DELETE', query: id }).then(() => {
          setShowModal(null)
          message.success('删除成功')
          tableRef.current.fetchData()
        })
      },
    })
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
    await request.todo({ method: 'PUT', query: showModal._id, data })
    await tableRef.current.fetchData()
    form.resetFields()
    setShowModal(null)
    setSubmitLoading(false)
  }

  const columns: ColumnsType<ITodo> = [
    {
      title: '用户',
      dataIndex: ['creator', 'username'],
    },
    {
      title: '日程时间',
      render: (_, record) => {
        return (
          <Tag className='werido-tag'>
            {dayjs(record.start).format('YYYY-MM-DD')}：{dayjs(record.start).format('HH:mm')}-
            {dayjs(record.end).format('HH:mm')}
          </Tag>
        )
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: val => formatTime(val),
    },
    {
      title: '操作',
      width: 180,
      render: (value, record) => {
        return (
          <Space style={{ marginLeft: -16 }}>
            <Button
              type='link'
              onClick={() => {
                setShowModal(record)
                const { start, end, description } = record
                form.setFieldsValue({
                  date: dayjs(start).startOf('day'),
                  time: [dayjs(start), dayjs(end)],
                  description,
                })
              }}
            >
              编辑
            </Button>
            <Button type='link' onClick={() => handleDelete(record._id)}>
              删除
            </Button>
          </Space>
        )
      },
    },
  ]

  return (
    <Fragment>
      <CommonTable
        ref={tableRef}
        request={request.admin.todo}
        title={() => '日程管理'}
        toolList={toolList}
        columns={columns}
      />

      <Modal
        title={`编辑日程`}
        open={!!showModal}
        onOk={form.submit}
        width={500}
        okButtonProps={{ loading: submitLoading }}
        onCancel={() => {
          setShowModal(null)
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

export default TodoManage
