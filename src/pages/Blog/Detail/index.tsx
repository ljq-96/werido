import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Tag,
  Affix,
  Spin,
  PageHeader,
  Tooltip,
} from 'antd'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IBlog } from '../../../../types'
import { request } from '../../../api'
import { TranslateX } from '../../../components/Animation'
import Catalog, { CatalogInstance } from '../../../components/Catalog'
import CatalogIcon from '../../../components/CatalogIcon'
import MarkdownEditor, { EditorIntance } from '../../../components/MarkdownEditor'
import { useStore } from '../../../contexts/useStore'

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
          <Button type='primary' onClick={() => setOnEdit(!onEdit)}>
            编辑
          </Button>,
        ]
  }, [onEdit])

  useEffect(() => {
    setLoading(true)
    request
      .blog({ method: 'GET', query: id })
      .then(res => {
        setDetail(res)
        // editor.current.setValue(res.content)
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
    <Fragment>
      <Row gutter={16} wrap={false}>
        <Col flex='256px'>
          <Affix offsetTop={80}>
            <TranslateX>
              <Card
                title='目录'
                extra={
                  <Tooltip placement='bottom' title={expandCatalog ? '全部折叠' : '全部展开'}>
                    <Button
                      size='small'
                      type='text'
                      icon={<CatalogIcon open={expandCatalog} />}
                      onClick={() => {
                        if (expandCatalog) {
                          setExpandCatalog(false)
                          catalogRef.current.closeAll()
                        } else {
                          setExpandCatalog(true)
                          catalogRef.current.expandAll()
                        }
                      }}
                    />
                  </Tooltip>
                }
              >
                <Catalog ref={catalogRef} selectedKeys={[id]} />
              </Card>
            </TranslateX>
          </Affix>
        </Col>
        <Col flex='auto'>
          <Spin spinning={loading}>
            <PageHeader
              ghost={false}
              title={!onEdit && detail?.title}
              style={{ border: '1px solid #f0f0f0', borderBottom: 'none' }}
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
            />
            <MarkdownEditor ref={editor} readonly={!onEdit} value={detail?.content} />
          </Spin>
        </Col>
      </Row>
    </Fragment>
  )
}
export default BlogDetail
