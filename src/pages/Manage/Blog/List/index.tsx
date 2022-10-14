import { InfoCircleOutlined } from '@ant-design/icons'
import { Button, Dropdown, Form, Input, Menu, message, Modal, Segmented, Space, Tag } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IBlog, IUser } from '../../../../../types'
import { request } from '../../../../api'
import CommonTable, { CommonTableInstance, ToolItem } from '../../../../components/CommonTable'
import { formatTime } from '../../../../utils/common'
import useRequest from '../../../../hooks/useRequest'
import { StatisticsType } from '../../../../../types/enum'

function BlogManage() {
  const [showModal, setShowModal] = useState<boolean | IUser>(false)
  const [form] = Form.useForm()
  const tableRef = useRef<CommonTableInstance>(null)
  const navigate = useNavigate()
  const { data: tags, execute: getTags } = useRequest(() =>
    request.admin.statistics({ method: 'GET', query: StatisticsType.文章标签 }),
  )

  const toolList = useMemo<ToolItem[]>(() => {
    return [
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
        childrenProps: {
          options: tags?.map(item => ({ label: item.name, value: item.name })),
        },
      },
    ]
  }, [tags])

  const handleDelete = (id: string) => {
    Modal.confirm({
      type: 'error',
      title: '警告',
      icon: <InfoCircleOutlined style={{ color: 'red' }} />,
      content: '确定要删除此文章吗？',
      okButtonProps: { danger: true, children: '删除' },
      onOk() {
        return request.blog({ method: 'DELETE', query: id }).then(() => {
          // setShowModal(false)
          message.success('删除成功')
          tableRef.current.fetchData()
          return Promise.resolve()
        })
      },
    })
  }

  const handleSubmit = async (fields: Partial<IUser>) => {}

  const columns: ColumnsType<IBlog> = [
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '标题',
      dataIndex: 'title',
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
            <Button type='link' onClick={() => navigate(`/manage/blog/editor?id=${record._id}`)}>
              编辑
            </Button>
            <Button type='link' onClick={() => handleDelete(record._id)}>
              删除
            </Button>
            <Dropdown
              overlay={
                <Menu
                  items={[
                    { label: '查看', key: 'detail' },
                    { label: '导出', key: 'export' },
                  ]}
                ></Menu>
              }
            >
              <Button type='link'>更多</Button>
            </Dropdown>
          </Space>
        )
      },
    },
  ]

  useEffect(() => {
    getTags()
  }, [])

  return (
    <Fragment>
      <CommonTable
        ref={tableRef}
        request={request.admin.blog}
        title={() => '文章管理'}
        extra={
          <Space>
            <Button></Button>
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
