import { PageContainer, PageHeader } from '@ant-design/pro-layout'
import { Affix, Button, Form, Input, message, Select, Space } from 'antd'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchParam } from 'react-use'
import { IBlog } from '../../../../types'
import { StatisticsType } from '../../../../types/enum'
import { request } from '../../../api'
import MarkdownEditor, { EditorIntance } from '../../../components/MarkdownEditor'
import { useStore } from '../../../contexts/useStore'
import { MilkdownProvider } from '@milkdown/react'
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/react'

const BlogEditor = () => {
  const [{ tags }, { getTags }] = useStore()
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState<IBlog>()
  const id = useSearchParam('id')
  const editor = useRef<EditorIntance>(null)
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const tagOptions = useMemo(() => {
    return tags.map(item => ({ label: item.name, value: item.name }))
  }, [tags])

  const handleFinish = async fields => {
    // setLoading(true)
    // if (id) {
    //   await request.blog({ method: 'PUT', query: id, data: { content: editor.current.getValue(), ...fields } })
    //   message.success('已更新')
    // } else {
    //   await request.blog({ method: 'POST', data: { content: editor.current.getValue(), ...fields } })
    //   navigate(-1)
    //   message.success('已创建')
    // }
    // setLoading(false)
  }

  useEffect(() => {
    getTags()
  }, [])

  useEffect(() => {
    if (id) {
      request.blog({ method: 'GET', query: id }).then(res => {
        setDetail(res)
        // editor.current.setValue(res.content)
        form.setFieldsValue(res)
      })
    }
  }, [id])

  return (
    <div>
      <PageHeader
        onBack={() => navigate(-1)}
        subTitle={
          <Form form={form} onFinish={handleFinish} layout='inline'>
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
        }
        extra={
          <Affix offsetTop={64}>
            <Button type='primary' onClick={form.submit} loading={loading}>
              {id ? '更新' : '保存'}
            </Button>
          </Affix>
        }
      />
      <MilkdownProvider>
        <ProsemirrorAdapterProvider>
          <MarkdownEditor value={detail?.content} />
        </ProsemirrorAdapterProvider>
      </MilkdownProvider>
    </div>
  )
}

export default BlogEditor
