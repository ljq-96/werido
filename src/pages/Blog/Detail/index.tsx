import { CheckCircleOutlined, EditOutlined, RollbackOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-layout'
import { Button, Col, Divider, Form, Input, message, Row, Select, Space, Tag, Tooltip } from 'antd'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IBlog } from '../../../../types'
import { StatisticsType } from '../../../../types/enum'
import { request } from '../../../api'
import MarkdownEditor, { EditorIntance } from '../../../components/MarkdownEditor'

function BlogDetail() {
  const [onEdit, setOnEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState<IBlog>(null)
  const [tagOptions, setTagOptions] = useState<{ label: string; value: string }[]>([])
  const [form] = Form.useForm()
  const { id } = useParams()
  const editor = useRef<EditorIntance>()
  const navigate = useNavigate()

  const handleFinish = async fields => {
    setLoading(true)
    await request.blog.put({ _id: id, content: editor.current.getValue(), ...fields })
    message.success('已更新')
    setOnEdit(false)
    setLoading(false)
  }

  const extra = useMemo(() => {
    return onEdit
      ? [
          <Space split={<Divider type='vertical' />} size={0}>
            <Tooltip placement='bottom' title='取消'>
              <Button type='text' onClick={() => setOnEdit(!onEdit)} icon={<RollbackOutlined />} />
            </Tooltip>
            <Tooltip placement='bottom' title='保存'>
              <Button type='text' onClick={form.submit} icon={<CheckCircleOutlined />} />
            </Tooltip>
          </Space>,
        ]
      : [
          <Tooltip placement='bottom' title='编辑'>
            <Button type='text' onClick={() => setOnEdit(!onEdit)} icon={<EditOutlined />} />
          </Tooltip>,
        ]
  }, [onEdit])

  useEffect(() => {
    if (!onEdit) {
      setLoading(true)
      request.blog
        .get(id)
        .then(res => {
          editor.current.setValue(res.content)
          setDetail(res)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [id, onEdit])

  useEffect(() => {
    request.statistics.get(StatisticsType.文章标签).then(res => {
      setTagOptions(res.map(item => ({ label: item.name, value: item.name })))
    })
  }, [])

  return (
    <Fragment>
      <PageContainer
        title={!onEdit && detail?.title}
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
        onBack={() => navigate(-1)}
        tags={
          !onEdit &&
          detail?.tags?.map(item => (
            <Tag className='werido-tag' key={item} onClick={() => {}}>
              {item}
            </Tag>
          ))
        }
        extra={extra}
      >
        <Row gutter={16}>
          <Col flex='200px'></Col>
          <Col flex='auto'>
            <div>
              <MarkdownEditor ref={editor} readonly={!onEdit} loading={loading} />
            </div>
          </Col>
        </Row>
      </PageContainer>
    </Fragment>
  )
}
export default BlogDetail
