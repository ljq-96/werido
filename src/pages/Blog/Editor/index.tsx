import { PageContainer } from '@ant-design/pro-layout'
import { Affix, Button, Form, Input, message, PageHeader, Select, Space } from 'antd'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchParam } from 'react-use'
import { StatisticsType } from '../../../../types/enum'
import { request } from '../../../api'
import MarkdownEditor, { EditorIntance } from '../../../components/MarkdownEditor'
import { useStore } from '../../../contexts/useStore'

const BlogEditor = () => {
  const [{ tags }, { getTags }] = useStore()
  const [loading, setLoading] = useState(false)
  const id = useSearchParam('id')
  const editor = useRef<EditorIntance>(null)
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const tagOptions = useMemo(() => {
    return tags.map(item => ({ label: item.name, value: item.name }))
  }, [tags])

  const handleFinish = async fields => {
    setLoading(true)
    if (id) {
      await request.blog.put({ _id: id, content: editor.current.getValue(), ...fields })
      message.success('已更新')
    } else {
      await request.blog.post({ content: editor.current.getValue(), ...fields })
      navigate(-1)
      message.success('已创建')
    }
    setLoading(false)
  }

  useEffect(() => {
    getTags()
  }, [])

  useEffect(() => {
    if (id) {
      request.blog.get(id).then(res => {
        editor.current.setValue(res.content)
        form.setFieldsValue(res)
      })
    }
  }, [id])

  return (
    <div>
      <PageHeader
        ghost={false}
        onBack={() => navigate(-1)}
        style={{ border: '1px solid #f0f0f0', borderBottom: 'none' }}
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
      <MarkdownEditor ref={editor} />
    </div>
  )
}

export default BlogEditor
