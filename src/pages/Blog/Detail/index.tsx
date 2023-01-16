/** @jsxImportSource @emotion/react */
import { MoreOutlined, ShareAltOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-layout'
import { Button, Form, Input, message, Select, Space, Tag, Affix, Dropdown, theme } from 'antd'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IBlog, ICatalog } from '../../../../types'
import { request } from '../../../api'
import { TranslateX } from '../../../components/Animation'
import Catalog, { CatalogInstance } from '../../../components/Catalog'
import CatalogIcon from '../../../components/CatalogIcon'
import MarkdownEditor, { EditorIntance } from '../../../components/MarkdownEditor'
import { useStore } from '../../../contexts/useStore'
import { downloadFile } from '../../../utils/common'

function BlogDetail() {
  const [{ tags }, { getTags }] = useStore()
  const [onEdit, setOnEdit] = useState(false)
  const [expandCatalog, setExpandCatalog] = useState(true)
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState<IBlog>(null)
  const [form] = Form.useForm()
  const { id } = useParams()
  const editor = useRef<EditorIntance>()
  const catalogRef = useRef<CatalogInstance>(null)
  const navigate = useNavigate()
  const tagOptions = useMemo(() => {
    return tags.map(item => ({ label: item.name, value: item.name }))
  }, [tags])
  const {
    token: { borderRadius, colorBorderSecondary, colorBgContainer },
  } = theme.useToken()

  const handleFinish = async fields => {
    setLoading(true)
    await request.blog({ method: 'PUT', query: id, data: { content: editor.current.getValue(), ...fields } })
    message.success('已更新')
    setOnEdit(false)
    setLoading(false)
  }

  const extra = useMemo(() => {
    return onEdit
      ? [
          <Affix offsetTop={64}>
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
          <Button type='text' icon={<ShareAltOutlined />} />,
          <Dropdown
            placement='bottomRight'
            menu={{
              items: [
                {
                  label: '导出',
                  key: 1,
                  onClick: () => request.blogExport({ method: 'POST', data: { blogId: id }, responseType: 'blob' }),
                },
                { label: '编辑', key: 2, onClick: () => setOnEdit(!onEdit) },
              ],
            }}
          >
            <Button type='text' icon={<MoreOutlined />} />
          </Dropdown>,
        ]
  }, [onEdit, id, detail])

  useEffect(() => {
    setLoading(true)
    request
      .blog({ method: 'GET', query: id })
      .then(res => {
        setDetail(res)
        form.setFieldsValue({ title: res.title, tags: res.tags })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id, onEdit])

  useEffect(() => {
    getTags()
  }, [])

  return (
    <PageContainer
      title={!onEdit && detail?.title}
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
            <Form form={form} onFinish={handleFinish} layout='inline'>
              <Form.Item name='title' rules={[{ required: true, message: '' }]} initialValue={detail.title}>
                <Input placeholder='请输入标题' style={{ width: 256 }} allowClear />
              </Form.Item>
              <Form.Item label='标签' name='tags' initialValue={detail.tags}>
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
      <MarkdownEditor ref={editor} readonly={!onEdit} value={detail?.content} />
    </PageContainer>
  )
}
export default BlogDetail
