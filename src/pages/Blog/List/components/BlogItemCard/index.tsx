import { ArrowRightOutlined, FieldTimeOutlined, FileTextOutlined } from '@ant-design/icons'
import { Button, Card, Divider, Row, Space, theme } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { IBlog } from '../../../../../../types'
import { EditorIntance, Render } from '../../../../../components/MarkdownEditor'
import { css, jsx } from '@emotion/react'
import { Fragment, useEffect, useRef } from 'react'
import dayjs from 'dayjs'
import { MilkdownProvider } from '@milkdown/react'
import { ProsemirrorAdapterProvider } from '@prosemirror-adapter/react'

/** @jsxImportSource @emotion/react */
const BlogItemCard = ({ item }: { item: IBlog }) => {
  const { title, content, description, tags, cover, createTime, words, _id } = item
  const { token } = theme.useToken()
  const navigate = useNavigate()
  const editorRef = useRef<EditorIntance>(null)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setValue(content)
    }
  }, [content])

  return (
    <Fragment>
      <MilkdownProvider key={_id}>
        <ProsemirrorAdapterProvider>
          <Card
            className='blog-item'
            size='small'
            css={css({
              marginBottom: 16,
              '.desc': {
                color: token.colorTextDescription,
              },
              '.title': {
                fontSize: '1.5em',
                transition: '0.2s',
                margin: '8px 0',
                color: token.colorText,
                '&:hover': {
                  color: token.colorPrimary,
                },
              },
            })}
            cover={cover && <img src={cover} css={css({ height: 260, objectFit: 'cover' })} />}
          >
            <div className='desc'>
              <Space>
                <Space size='small'>
                  <FieldTimeOutlined />
                  {dayjs(createTime).format('YYYY-MM-DD HH:mm:ss')}
                </Space>
                <Divider type='vertical' />
                <Space size='small'>
                  <FileTextOutlined />
                  {`${words}字`}
                </Space>
              </Space>
            </div>
            <Link to={`/blog/${_id}`} className='title'>
              {title}
            </Link>
            <div css={css({ marginTop: 8 })}>
              <Render ref={editorRef} key={_id} value={description} />
            </div>
            <Button
              size='small'
              type='text'
              onClick={() => navigate(`/blog/${_id}`)}
              css={css({
                background: token.colorBgLayout,
              })}
            >
              阅读全文 <ArrowRightOutlined />
            </Button>
          </Card>
        </ProsemirrorAdapterProvider>
      </MilkdownProvider>
    </Fragment>
  )
}

export default BlogItemCard
