import {} from 'antd'
import { Blog } from '../../../../../server/interfaces'
import style from './style.module.less'

const BlogItemCard = (props: Blog.Doc) => {
  const { title, content, description, tags, createTime } = props
  return (
    <div className={style.blogItem}>
      <div className='blog-item-title'>{title}</div>
    </div>
  )
}

export default BlogItemCard
