import { InfoCircleOutlined } from '@ant-design/icons'
import { Button, Form, Input, message, Modal, Space } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { Fragment, useRef, useState } from 'react'
import { IUser } from '../../../../types'
import { UserStatus } from '../../../../types/enum'
import { request } from '../../../api'
import CommonTable, { CommonTableInstance, ToolItem } from '../../../components/CommonTable'
import { formatTime } from '../../../utils/common'

const toolList: ToolItem[] = [
  {
    type: 'input',
    name: 'username',
    label: '用户名',
  },
  {
    type: 'date',
    name: 'createTime',
    label: '创建时间',
  },
]

function UsersManage() {
  const [showModal, setShowModal] = useState<boolean | IUser>(false)
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

  const handleSubmit = async (fields: Partial<IUser>) => {
    if (typeof showModal === 'boolean') {
      const { username, password } = fields
      await request.admin.user({ method: 'POST', data: { username, password } })
      message.success('新增成功')
    } else {
      const { _id, ...reset } = fields
      await request.admin.user({ method: 'PUT', query: _id, data: reset })
      message.success('修改成功')
    }
    setShowModal(false)
    tableRef.current.fetchData()
  }

  const columns: ColumnsType<IUser> = [
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: val => UserStatus[val],
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
        request={request.admin.user}
        title={() => '用户管理'}
        extra={
          <Button type='primary' onClick={() => setShowModal(true)}>
            新增用户
          </Button>
        }
        toolList={toolList}
        columns={columns}
      />

      <Modal
        title={`${typeof showModal === 'boolean' ? '新增' : '编辑'}用户`}
        open={!!showModal}
        onOk={form.submit}
        onCancel={() => {
          setShowModal(false)
          form.resetFields()
        }}
      >
        <Form form={form} labelCol={{ style: { width: 70 } }} onFinish={handleSubmit} autoComplete={'false'}>
          <Form.Item label='用户名' name='username' rules={[{ required: true, message: '请输入用户名！' }]}>
            <Input placeholder='请输入用户名' />
          </Form.Item>
          <Form.Item label='密码' name='password' rules={[{ required: true, message: '请输入密码！' }]}>
            <Input.Password placeholder='请输入密码' />
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  )
}

export default UsersManage
