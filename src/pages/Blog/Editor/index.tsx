import { PageContainer } from '@ant-design/pro-layout'
import { Button, Form, Input, message, Select } from 'antd'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearchParam } from 'react-use'
import { StatisticsType } from '../../../../types/enum'
import { request } from '../../../api'
import MarkdownEditor, { EditorIntance } from '../../../components/MarkdownEditor'

const BlogEditor = () => {
  const [loading, setLoading] = useState(false)
  const [tagOptions, setTagOptions] = useState<{ label: string; value: string }[]>([])
  const id = useSearchParam('id')
  const editor = useRef<EditorIntance>(null)
  const navigate = useNavigate()
  const [form] = Form.useForm()

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
    if (id) {
      request.blog.get(id).then(res => {
        editor.current.setValue(res.content)
        form.setFieldsValue(res)
      })
    }
    request.statistics.get(StatisticsType.文章标签).then(res => {
      setTagOptions(res.map(item => ({ label: item.name, value: item.name })))
    })
  }, [id])

  return (
    <div>
      <PageContainer
        title={id ? '编辑文章' : '新增文章'}
        content={
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
        footer={[
          <Button onClick={() => navigate(-1)}>取消</Button>,
          <Button type='primary' onClick={form.submit} loading={loading}>
            {id ? '更新' : '保存'}
          </Button>,
        ]}
      >
        <MarkdownEditor ref={editor} />
      </PageContainer>
    </div>
  )
}

export default BlogEditor
