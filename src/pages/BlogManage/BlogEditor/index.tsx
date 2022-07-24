import { Button, Card, Dropdown, Form, Input, Menu, message, PageHeader, Row, Select, Space, Spin } from 'antd'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchParam } from 'react-use'
import { blogApi } from '../../../api'
import MarkdownEditor, { EditorIntance } from '../../../components/MarkdownEditor'
import useRequest from '../../../hooks/useRequest'

const BlogEditor = () => {
  const [loading, setLoading] = useState(false)
  const id = useSearchParam('id')
  const editor = useRef<EditorIntance>(null)
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const handleFinish = async (fields) => {
    setLoading(true)
    if (id) {
      await blogApi.put(id, { content: editor.current.getValue(), ...fields })
    } else {
      await blogApi.post({ content: editor.current.getValue(), ...fields })
    }
    setLoading(false)
  }

  useEffect(() => {
    if (id) {
      blogApi.getById(id).then((res) => {
        editor.current.setValue(res.data.content)
        form.setFieldsValue(res.data)
      })
    }
  }, [id])

  return (
    <div>
      <PageHeader
        subTitle={
          <div style={{ height: 32 }}>
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
          <Button type='primary' onClick={form.submit} loading={loading}>
            {id ? '更新' : '保存'}
          </Button>,
        ]}
      />
      {/* <Row
        justify='space-between'
        style={{ padding: 16, backgroundColor: '#fff', height: 65, border: '1px solid #f0f0f0', borderBottom: 'none' }}>
        <Form form={form} onFinish={handleFinish} layout='inline'>
          <Form.Item label='标题' name='title' rules={[{ required: true, message: '' }]}>
            <Input placeholder='请输入标题' style={{ width: 256 }} allowClear />
          </Form.Item>
          <Form.Item label='标签' name='tags'>
            <Select mode='tags' placeholder='请选择标签' maxTagCount='responsive' style={{ width: 256 }} allowClear />
          </Form.Item>
        </Form>
        <Button type='primary' onClick={form.submit} loading={loading}>
          {id ? '更新' : '保存'}
        </Button>
      </Row> */}
      <MarkdownEditor height={'calc(100vh - 275px)'} ref={editor} />
    </div>
  )
}

export default BlogEditor
