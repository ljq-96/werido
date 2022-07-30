import { FieldStringOutlined, FieldTimeOutlined, FileTextOutlined } from '@ant-design/icons'
import { Space } from 'antd'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { BlogType } from '../../../../../server/types'
import style from './style.module.less'

const BlogItemCard = ({ item }: { item: BlogType }) => {
  const { title, content, description, tags, createTime, _id } = item
  const navigate = useNavigate()
  return (
    <div className={style.blogItem} onClick={() => navigate(`/blog/${_id}`)}>
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
