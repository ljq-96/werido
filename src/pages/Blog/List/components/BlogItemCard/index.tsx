import { FieldStringOutlined, FieldTimeOutlined, FileTextOutlined } from '@ant-design/icons'
import { Card, Space } from 'antd'
import clsx from 'clsx'
import moment from 'moment'
import { Link, useNavigate } from 'react-router-dom'
import { IBlog } from '../../../../../../types'
import { Render } from '../../../../../components/MarkdownEditor'
import style from './style.module.less'

const BlogItemCard = ({ item }: { item: IBlog }) => {
  const { title, content, description, tags, createTime, words, _id } = item
  const navigate = useNavigate()
  return (
    <Link to={`/blog/${_id}`} className={style.blogItem}>
      <div className={clsx('werido-title', style.title)} style={{ margin: '0 -16px' }}>
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
    </Link>
  )
}

export default BlogItemCard
