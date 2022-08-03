import { FieldStringOutlined, FieldTimeOutlined, FileTextOutlined } from '@ant-design/icons'
import { Card, Space } from 'antd'
import clsx from 'clsx'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { BlogType } from '../../../../../server/types'
import { Render } from '../../../../components/MarkdownEditor'
import style from './style.module.less'

const BlogItemCard = ({ item }: { item: BlogType }) => {
  const { title, content, description, tags, createTime, words, _id } = item
  const navigate = useNavigate()
  return (
    <div className={style.blogItem}>
      <div className={style.title} onClick={() => navigate(`/blog/${_id}`)}>
        {title}
      </div>
      <div className={style.description}>
        <Render key={_id} value={description} />
      </div>
      <div className={style.meta}>
        <Space size='large'>
          <Space size='small'>
            <FieldTimeOutlined />
            {moment(createTime).format('yyyy-MM-DD HH:mm:ss')}
          </Space>
          <Space size='small'>
            <FileTextOutlined />
            {`${words}字`}
          </Space>
        </Space>
      </div>
    </div>
  )
}

export default BlogItemCard
