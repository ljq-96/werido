import { FieldTimeOutlined, FileTextOutlined } from '@ant-design/icons'
import { Space, theme } from 'antd'
import { Link } from 'react-router-dom'
import { IBlog } from '../../../../../../types'
import { Render } from '../../../../../components/MarkdownEditor'
import { css, jsx } from '@emotion/react'
import { Fragment } from 'react'
import dayjs from 'dayjs'

/** @jsxImportSource @emotion/react */
const BlogItemCard = ({ item }: { item: IBlog }) => {
  const { title, content, description, tags, createTime, words, _id } = item
  const { token } = theme.useToken()

  return (
    <Fragment>
      <Link
        to={`/blog/${_id}`}
        className='blog-item'
        css={css({
          display: 'block',
          borderRadius: token.borderRadius,
          padding: 16,
          border: `1px solid ${token.colorBorderSecondary}`,
          backgroundColor: token.colorBgContainer,
          transition: '0.4s',
          marginBottom: 16,
          color: 'unset',
          '&:hover': {
            color: 'unset',
            backgroundColor: token.colorBgLayout,
            '.title': {
              color: token.colorPrimary,
            },
          },
        })}
      >
        <div
          className='title'
          css={css({ fontSize: 16, fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', marginBottom: 16 })}
        >
          {title}
        </div>
        <div css={css({ margin: description ? -16 : 0 })}>
          <Render key={_id} value={description} />
        </div>
        <div css={css({ color: '#8a8f8d' })}>
          <Space size='large'>
            <Space size='small'>
              <FieldTimeOutlined />
              {dayjs(createTime).format('YYYY-MM-DD HH:mm:ss')}
            </Space>
            <Space size='small'>
              <FileTextOutlined />
              {`${words}字`}
            </Space>
          </Space>
        </div>
      </Link>
    </Fragment>
  )
}

export default BlogItemCard
