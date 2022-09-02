import {
  CheckCircleOutlined,
  EditOutlined,
  FieldTimeOutlined,
  FileTextOutlined,
  RollbackOutlined,
} from '@ant-design/icons'
import {
  Affix,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  PageHeader,
  Row,
  Select,
  Space,
  Spin,
  Tag,
  Tooltip,
} from 'antd'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IBlog } from '../../../../types'
import { request } from '../../../api'
import MarkdownEditor, { EditorIntance } from '../../../components/MarkdownEditor'
import { useUser } from '../../../contexts/useUser'
import { formatTime } from '../../../utils/common'

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
    request.statistics.get('tag').then(res => {
      setTagOptions(res.map(item => ({ label: item.name, value: item.name })))
    })
  }, [])

  return (
    <Fragment>
      <PageHeader
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
        ghost={false}
        style={{ margin: '-16px -16px 16px' }}
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
        {!onEdit && (
          <Space size='large' style={{ color: '#aaa' }}>
            <Space size='small'>
              <FieldTimeOutlined />
              {formatTime(detail?.createTime)}
            </Space>
            <Space size='small'>
              <FileTextOutlined />
              {`${detail?.content?.length}字`}
            </Space>
          </Space>
        )}
      </PageHeader>
      <Row gutter={16}>
        <Col flex='200px'>
          <Affix offsetTop={16} target={() => document.getElementById('content')}>
            <Card></Card>
          </Affix>
        </Col>
        <Col flex='auto'>
          <div className='bg-gray-50 min-h-screen'>
            <MarkdownEditor ref={editor} readonly={!onEdit} loading={loading} />
          </div>
        </Col>
      </Row>
    </Fragment>
  )
}
export default BlogDetail
