import { InfoCircleOutlined } from '@ant-design/icons'
import { Button, message, Modal, Space, Tag } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import dayjs from 'dayjs'
import { Fragment, useRef } from 'react'
import { ITodo } from '../../../../types'
import { request } from '../../../api'
import CommonTable, { CommonTableInstance, ToolItem } from '../../../components/CommonTable'
import { formatTime } from '../../../utils/common'
import EasyModal from '../../../utils/easyModal'
import TodoModal from '../../../modals/TodoModal'

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
  const tableRef = useRef<CommonTableInstance>(null)

  const handleDelete = (id: string) => {
    Modal.confirm({
      type: 'error',
      title: '警告',
      icon: <InfoCircleOutlined style={{ color: 'red' }} />,
      content: '确定要删除此日程吗？',
      okButtonProps: { danger: true, children: '删除' },
      onOk() {
        return request.adminTodo.deleteTodo({ method: 'DELETE', params: { id } }).then(() => {
          message.success('删除成功')
          tableRef.current.fetchData()
        })
      },
    })
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
                EasyModal.show(TodoModal, record).then(() => tableRef.current.fetchData())
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
        request={request.adminStatistics.getTodo}
        title={() => '日程管理'}
        toolList={toolList}
        columns={columns}
      />
    </Fragment>
  )
}

export default TodoManage
