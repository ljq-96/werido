import { FieldStringOutlined, FieldTimeOutlined, FileTextOutlined } from '@ant-design/icons'
import { Space } from 'antd'
import moment from 'moment'
import { Blog } from '../../../../../server/interfaces'
import style from './style.module.less'

const BlogItemCard = (props: Blog.Doc) => {
  const { title, content, description, tags, createTime } = props
  return (
    <div className={style.blogItem}>
      <div className={style.title}>{title}</div>
      <div className={style.description}>{content}</div>
      <div className={style.meta}>
        <Space size='large'>
          <Space size='small'>
            <FieldTimeOutlined />
            {moment(createTime).format('yyyy-MM-DD HH:mm:ss')}
          </Space>
          <Space size='small'>
            <FileTextOutlined />
            {`${content.length}字`}
          </Space>
        </Space>
      </div>
    </div>
  )
}

export default BlogItemCard
