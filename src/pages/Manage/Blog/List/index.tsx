import { InfoCircleOutlined } from '@ant-design/icons'
import { Button, Form, Input, message, Modal, Segmented, Space, Tag } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { Fragment, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BlogType, UserType } from '../../../../../server/types'
import { request } from '../../../../api'
import CommonTable, { CommonTableInstance, ToolItem } from '../../../../components/CommonTable'
import { formatTime } from '../../../../utils/common'

const toolList: ToolItem[] = [
  {
    type: 'input',
    name: 'username',
    label: '文章标题',
  },
  {
    type: 'date',
    name: 'createTime',
    label: '创建时间',
  },
  {
    type: 'select',
    name: 'tags',
    label: '标签',
  },
]

function BlogManage() {
  const [showModal, setShowModal] = useState<boolean | UserType>(false)
  const [form] = Form.useForm()
  const tableRef = useRef<CommonTableInstance>(null)
  const navigate = useNavigate()

  const handleDelete = (id: string) => {
    Modal.confirm({
      type: 'error',
      title: '警告',
      icon: <InfoCircleOutlined style={{ color: 'red' }} />,
      content: '确定要删除此用户吗？',
      okButtonProps: { danger: true, children: '删除' },
      onOk() {
        return request.blog.delete(id).then(() => {
          // setShowModal(false)
          message.success('删除成功')
          tableRef.current.fetchData()
          return Promise.resolve()
        })
      },
    })
  }

  const handleSubmit = async (fields: Partial<UserType>) => {}

  const columns: ColumnsType<BlogType> = [
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '标签',
      dataIndex: 'tags',
      render: (val: string[]) =>
        val?.length
          ? val.map(item => (
              <Tag className='werido-tag' key={item}>
                {item}
              </Tag>
            ))
          : '--',
    },
    {
      title: '字数',
      dataIndex: 'words',
      sorter: true,
      render: (val: number) => (val ? val.toLocaleString() : '--'),
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
            <Button type='link' onClick={() => {}}>
              查看
            </Button>
            <Button type='link' onClick={() => navigate(`/manage/blog/editor?id=${record._id}`)}>
              编辑
            </Button>
            <Button type='link' danger onClick={() => handleDelete(record._id)}>
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
        request={request.blog}
        title={() => (
          <Space>
            文章管理
            <Segmented
              options={[
                { label: '管理员', value: 'admin' },
                { label: '自己', value: 'mine' },
              ]}
            />
          </Space>
        )}
        extra={
          <Space>
            <Button type='primary' onClick={() => navigate('/manage/blog/editor')}>
              新建文章
            </Button>
          </Space>
        }
        toolList={toolList}
        columns={columns}
      />

      <Modal
        title={`${typeof showModal === 'boolean' ? '新增' : '编辑'}用户`}
        visible={!!showModal}
        onOk={form.submit}
        onCancel={() => {
          setShowModal(false)
          form.resetFields()
        }}
      >
        <Form form={form} labelCol={{ style: { width: 70 } }} onFinish={handleSubmit}>
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

export default BlogManage
