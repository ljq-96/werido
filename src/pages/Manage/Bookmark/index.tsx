import { InfoCircleOutlined } from '@ant-design/icons'
import { Avatar, Button, Form, Input, message, Modal, Space } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { Fragment, useRef, useState } from 'react'
import { IBookmark, IUser } from '../../../../types'
import { UserStatus } from '../../../../types/enum'
import { request } from '../../../api'
import CommonTable, { CommonTableInstance, ToolItem } from '../../../components/CommonTable'
import BookmarkModal from '../../../components/Modal/BookmarkModal'
import { formatTime } from '../../../utils/common'

const toolList: ToolItem[] = [
  {
    type: 'input',
    name: 'creator',
    label: '用户',
  },
  {
    type: 'input',
    name: 'title',
    label: '标题',
  },
  {
    type: 'input',
    name: 'url',
    label: '地址',
  },
  {
    type: 'date',
    name: 'createTime',
    label: '创建时间',
  },
]

function UsersManage() {
  const [showModal, setShowModal] = useState<boolean | IBookmark>(false)
  const [form] = Form.useForm()
  const tableRef = useRef<CommonTableInstance>(null)

  const handleDelete = (id: string) => {
    Modal.confirm({
      type: 'error',
      title: '警告',
      icon: <InfoCircleOutlined style={{ color: 'red' }} />,
      content: '确定要删除此用户吗？',
      okButtonProps: { danger: true, children: '删除' },
      onOk() {
        return request.admin.user({ method: 'DELETE', query: id }).then(() => {
          setShowModal(false)
          message.success('删除成功')
          tableRef.current.fetchData()
        })
      },
    })
  }

  const handleSubmit = async (fields: Partial<IBookmark>) => {
    tableRef.current.fetchData()
  }

  const columns: ColumnsType<IBookmark> = [
    {
      title: '用户',
      dataIndex: ['creator', 'username'],
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      render: val => (
        <Avatar shape='square' src={val} style={{ objectFit: 'contain' }}>
          {val?.[0]}
        </Avatar>
      ),
    },
    {
      title: '地址',
      dataIndex: 'url',
      render: val => <a href={val}>{val}</a>,
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
                form.setFieldsValue(record)
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
        request={request.admin.bookmark}
        title={() => '书签管理'}
        toolList={toolList}
        columns={columns}
      />

      <BookmarkModal
        visible={showModal}
        onCancle={() => setShowModal(false)}
        onOk={() => {
          setShowModal(false)
          tableRef.current.fetchData()
        }}
      />
    </Fragment>
  )
}

export default UsersManage
