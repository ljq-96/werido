import { FieldTimeOutlined, FileTextOutlined } from '@ant-design/icons'
import { Affix, Button, Card, Col, PageHeader, Row, Space, Spin, Tag } from 'antd'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IBlog } from '../../../../../server/types'
import { request } from '../../../../api'
import MarkdownEditor, { EditorIntance } from '../../../../components/MarkdownEditor'
import { formatTime } from '../../../../utils/common'

function BlogDetail() {
  const [onEdit, setOnEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState<IBlog>(null)
  const { id } = useParams()
  const editor = useRef<EditorIntance>()
  const navigate = useNavigate()

  useEffect(() => {
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
  }, [id])

  return (
    <Fragment>
      <Spin spinning={loading}>
        <PageHeader
          title={detail?.title}
          ghost={false}
          style={{ margin: '-16px -16px 16px' }}
          onBack={() => navigate(-1)}
          tags={detail?.tags?.map(item => (
            <Tag className='werido-tag' key={item} onClick={() => {}}>
              {item}
            </Tag>
          ))}
          extra={[
            <Button type='primary' onClick={() => setOnEdit(!onEdit)}>
              编辑
            </Button>,
          ]}
        >
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
        </PageHeader>
        <Row gutter={16}>
          <Col flex='200px'>
            <Affix offsetTop={16} target={() => document.getElementById('content')}>
              <Card></Card>
            </Affix>
          </Col>
          <Col flex='auto'>
            <MarkdownEditor ref={editor} readonly={!onEdit} />
          </Col>
        </Row>
      </Spin>
    </Fragment>
  )
}
export default BlogDetail
