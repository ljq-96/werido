import { PageHeader } from '@ant-design/pro-layout'
import { Button, Form, Input, message, Select } from 'antd'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchParam } from 'react-use'
import { StatisticsType } from '../../../../../types/enum'
import { request } from '../../../../api'
import MarkdownEditor, { EditorIntance } from '../../../../components/MarkdownEditor'
import { MilkdownProvider } from '@milkdown/react'
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/react'
import { IBlog } from '../../../../../types'

const BlogEditor = () => {
  const [loading, setLoading] = useState(false)
  const [tagOptions, setTagOptions] = useState<{ label: string; value: string }[]>([])
  const [detail, setDetail] = useState<IBlog>()
  const id = useSearchParam('id')
  const editor = useRef<EditorIntance>(null)
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const handleFinish = async fields => {
    setLoading(true)
    if (id) {
      await request.blog.updateBlog({ params: { id }, body: { content: detail?.content, ...fields } })
      message.success('已更新')
    } else {
      await request.blog.createBlog({ body: { content: detail?.content, ...fields } })
      navigate(-1)
      message.success('已创建')
    }
    setLoading(false)
  }

  useEffect(() => {
    if (id) {
      request.blog.getBlogById({ params: { id } }).then(res => {
        // editor.current.setValue(res.content)
        setDetail(res)
        form.setFieldsValue(res)
      })
    }
    request.statistics.getBlogTags().then(res => {
      setTagOptions(res.map(item => ({ label: item.name, value: item.name })))
    })
  }, [id])

  return (
    <div>
      <PageHeader
        subTitle={
          <div style={{ height: 32 }}>
            <Form form={form} variant='filled' onFinish={handleFinish} layout='inline'>
              <Form.Item name='title' rules={[{ required: true, message: '' }]}>
                <Input placeholder='请输入标题' style={{ width: 256 }} allowClear />
              </Form.Item>
              <Form.Item label='标签' name='tags'>
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
        }
        onBack={() => navigate(-1)}
        ghost={false}
        style={{ margin: '-16px -16px 16px' }}
        extra={[
          <Button type='primary' onClick={form.submit} loading={loading} key={1}>
            {id ? '更新' : '保存'}
          </Button>,
        ]}
      />
      {detail && (
        <MilkdownProvider>
          <ProsemirrorAdapterProvider>
            <MarkdownEditor
              readonly={false}
              value={detail.content}
              onChange={e => setDetail({ ...detail, content: e })}
            />
          </ProsemirrorAdapterProvider>
        </MilkdownProvider>
      )}
    </div>
  )
}

export default BlogEditor
