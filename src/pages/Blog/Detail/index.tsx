/** @jsxImportSource @emotion/react */
import { MoreOutlined, ShareAltOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-layout'
import { Button, Form, Input, message, Select, Space, Tag, Affix, Dropdown, theme, Popover, QRCode } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { IBlog } from '../../../../types'
import { request } from '../../../api'
import MarkdownEditor, { EditorIntance } from '../../../components/MarkdownEditor'
import { MilkdownProvider } from '@milkdown/react'
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/react'
import { useStore } from '../../../store'

function BlogDetail() {
  const { tags, getTags } = useStore(({ tags, getTags }) => ({ tags, getTags }))
  const { state } = useLocation()
  const [onEdit, setOnEdit] = useState(() => !!(state as any)?.isEdit)
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState<IBlog>(null)
  const [form] = Form.useForm()
  const { id } = useParams()
  const editor = useRef<EditorIntance>()
  const navigate = useNavigate()
  const tagOptions = useMemo(() => {
    return tags.map(item => ({ label: item.name, value: item.name }))
  }, [tags])

  const handleFinish = async fields => {
    setLoading(true)
    await request.blog.updateBlog({
      method: 'PUT',
      params: { id },
      body: { content: editor.current.getValue(), ...fields },
    })
    message.success('已更新')
    setOnEdit(false)
    setLoading(false)
  }

  const extra = useMemo(() => {
    return onEdit
      ? [
          <Affix offsetTop={64} style={{ position: 'relative', zIndex: 999 }} key={1}>
            <Space>
              <Button type='default' onClick={() => setOnEdit(!onEdit)}>
                取消
              </Button>
              <Button type='primary' onClick={form.submit}>
                保存
              </Button>
            </Space>
          </Affix>,
        ]
      : [
          <Popover
            key={2}
            overlayInnerStyle={{ padding: 0 }}
            content={<QRCode value={location.href} bordered={false} />}
          >
            <Button type='text' icon={<ShareAltOutlined />} />
          </Popover>,
          <Dropdown
            key={3}
            placement='bottomRight'
            menu={{
              items: [
                {
                  label: '导出',
                  key: 1,
                  onClick: () =>
                    request.blog.exportBlog({ method: 'POST', body: { blogId: id }, responseType: 'blob' }),
                },
                { label: '编辑', key: 2, onClick: () => setOnEdit(!onEdit) },
              ],
            }}
          >
            <Button type='text' icon={<MoreOutlined />} />
          </Dropdown>,
        ]
  }, [onEdit, id, detail])

  const getData = () => {
    setLoading(true)
    request.blog
      .getBlogById({ method: 'GET', params: { id } })
      .then(res => {
        setDetail(res)
        form.setFieldsValue({ title: res.title, tags: res.tags })
        editor.current?.setValue(res.content)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getData()
  }, [id])

  useEffect(() => {
    if ((state as any)?.isEdit) setOnEdit(true)
  }, [state])

  useEffect(() => {
    getTags()
  }, [])

  return (
    <PageContainer
      title={!onEdit && detail?.title}
      ghost={false}
      onBack={() => navigate('/blog', { replace: true })}
      tags={
        !onEdit &&
        detail?.tags?.map(item => (
          <Tag className='werido-tag' key={item} onClick={() => {}}>
            {item}
          </Tag>
        ))
      }
      extra={extra}
      subTitle={
        onEdit && (
          <div style={{ height: 32 }}>
            <Form form={form} variant='filled' onFinish={handleFinish} layout='inline'>
              <Form.Item name='title' rules={[{ required: true, message: '' }]} initialValue={detail?.title}>
                <Input placeholder='请输入标题' style={{ width: 256 }} allowClear />
              </Form.Item>
              <Form.Item label='标签' name='tags' initialValue={detail?.tags}>
                <Select
                  mode='tags'
                  placeholder='请选择标签'
                  maxTagCount='responsive'
                  style={{ width: 256 }}
                  options={tagOptions}
                  allowClear
                />
              </Form.Item>
            </Form>
          </div>
        )
      }
    >
      <MarkdownEditor
        ref={editor}
        bordered={false}
        readonly={!onEdit}
        loading={loading}
        onReady={() => {
          getData()
        }}
      />
    </PageContainer>
  )
}
export default BlogDetail
